import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || '').trim().toLowerCase();
    const passcode = String(body.passcode || '').trim();

    if (!identifier || !passcode) {
      return NextResponse.json(
        { error: 'Please enter both your staff identifier and admin passcode.' },
        { status: 400 }
      );
    }

    // Require explicitly configured staff access key (with local development fallback)
    const isDev = process.env.NODE_ENV !== 'production' && !process.env.RENDER;
    const expectedKey = process.env.ADMIN_PASSCODE || process.env.STAFF_ACCESS_KEY || (isDev ? 'prayagraj2026' : undefined);
    if (!expectedKey) {
      console.error('[admin/login] ADMIN_PASSCODE environment variable is not configured.');
      return NextResponse.json(
        { error: 'Staff portal is temporarily locked. Contact platform administrator to configure access keys.' },
        { status: 503 }
      );
    }

    let isAuthorized = false;
    let staffName = 'Operations Staff';
    let staffRole: 'OPERATIONS' | 'ADMIN' = 'OPERATIONS';

    // 1. Check against configured secure staff access key
    if (passcode === expectedKey) {
      const cleanIdent = identifier.toLowerCase().trim();
      if (cleanIdent === 'admin' || cleanIdent === 'admin@find2stay.in' || cleanIdent === 'superadmin') {
        isAuthorized = true;
        staffName = 'System Administrator';
        staffRole = 'ADMIN';
      } else if (cleanIdent.includes('ops') || cleanIdent.includes('staff') || cleanIdent.includes('verifier')) {
        isAuthorized = true;
        staffName = 'Operations Team Member';
        staffRole = 'OPERATIONS';
      } else if (cleanIdent.length >= 3) {
        isAuthorized = true;
        staffName = identifier;
        staffRole = 'OPERATIONS';
      }
    }

    // 2. Check Database provisioned staff users if connected
    if (!isAuthorized) {
      try {
        const db = await getDb();
        const user = await db.collection('users').findOne({
          $or: [
            { email: identifier },
            { phoneE164: identifier },
            { phoneE164: identifier.startsWith('+91') ? identifier : `+91${identifier}` },
          ],
        });

        if (user && user.roleAssignments?.some((r: string) => ['ADMIN', 'OPERATIONS', 'SUPER_ADMIN'].includes(r))) {
          if (passcode === expectedKey) {
            isAuthorized = true;
            staffName = user.displayName || 'Authorized Staff';
            staffRole = user.roleAssignments.includes('ADMIN') ? 'ADMIN' : 'OPERATIONS';
          }
        }
      } catch (dbErr) {
        console.warn('[admin/login] DB check skipped:', (dbErr as Error).message);
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: 'Invalid staff credentials or access key. Access denied.',
        },
        { status: 401 }
      );
    }

    // Upgrade session to explicit staff role (Least privilege)
    const session = await getSession();
    session.userId = new ObjectId().toString();
    session.roles = staffRole === 'ADMIN' ? ['ADMIN', 'OPERATIONS', 'USER'] : ['OPERATIONS', 'USER'];
    session.phone = identifier.includes('@') ? '+919876500000' : identifier;
    session.name = staffName;
    session.rotatedAt = Date.now();
    await session.save();

    return NextResponse.json({
      success: true,
      message: `Authenticated as ${staffName}`,
      redirectUrl: '/admin',
    });
  } catch (err: any) {
    console.error('[admin/login error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Admin authentication failed.' },
      { status: 500 }
    );
  }
}
