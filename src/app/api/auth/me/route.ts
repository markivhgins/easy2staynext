import { NextResponse } from 'next/server';
import { getSession, getCurrentUser } from '@/lib/auth';
import { memoryDrafts } from '@/lib/memoryDrafts';
import type { Role } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ authenticated: false, user: null }, { headers });
    }

    const user = await getCurrentUser();
    const roles: Role[] = [...((session.roles as Role[]) || ((user?.roleAssignments as unknown) as Role[]) || ['USER'])];
    
    // Check if user has submitted properties in drafts or memory
    const phone = session.phone || (user as { phoneE164?: string })?.phoneE164 || '';
    const clean10 = phone.replace(/\D/g, '').slice(-10);
    let hasProperties = clean10
      ? memoryDrafts.some((m) => m.phone?.includes(clean10) || m.ownerId === session.userId)
      : false;

    if (!hasProperties && clean10) {
      try {
        const { getDb } = await import('@/lib/db');
        const db = await getDb();
        const found = await db.collection('drafts').findOne({
          $or: [{ phone: { $regex: clean10 } }, { ownerId: session.userId }],
        });
        if (found) hasProperties = true;
      } catch {}
    }

    if (hasProperties && !roles.includes('OWNER')) {
      roles.push('OWNER');
    }

    const primaryRole = roles.includes('OWNER') ? 'OWNER' : roles[0] || 'USER';

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          userId: session.userId,
          name: (user as { displayName?: string })?.displayName || session.name || 'Verified User',
          phone,
          roles,
          role: primaryRole,
          isOpsOrAdmin: roles.includes('ADMIN') || roles.includes('OPERATIONS') || roles.includes('SUPER_ADMIN'),
          isOwner: roles.includes('OWNER') || roles.includes('MANAGER') || hasProperties,
        },
      },
      { headers }
    );
  } catch (err) {
    console.error('Error fetching /api/auth/me:', err);
    return NextResponse.json({ authenticated: false, user: null }, { headers });
  }
}
