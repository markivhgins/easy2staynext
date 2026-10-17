import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

// In-memory status cache for instant demo & resilience
declare global {
  // eslint-disable-next-line no-var
  var _f2sOpsStatusOverrides: Map<string, string> | undefined;
}

if (!global._f2sOpsStatusOverrides) {
  global._f2sOpsStatusOverrides = new Map();
}
const statusOverrides = global._f2sOpsStatusOverrides;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const roles = session.roles || [];
    if (!roles.includes('OPERATIONS') && !roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Staff role required.' } }, { status: 403 });
    }

    const { collection, id, nextState } = await req.json();
    if (!collection || !id || !nextState) {
      return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Missing parameters.' } }, { status: 400 });
    }

    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
      enquiries: ['REQUESTED', 'CONFIRMED', 'CONTACTED', 'VISIT_SCHEDULED', 'RESOLVED', 'CLOSED', 'CANCELLED'],
      serviceConnections: ['ROUTING', 'PENDING_DISPATCH', 'DISPATCHED_TO_PROVIDER', 'CONNECTED', 'COMPLETED', 'CANCELLED'],
      drafts: ['DRAFT', 'SUBMITTED', 'INSPECTION_SCHEDULED', 'PUBLISHED', 'REJECTED'],
      listingVerifications: ['SUBMITTED', 'PHYSICAL_VERIFICATION_SCHEDULED', 'REPORT_FILED', 'VERIFIED', 'REJECTED'],
    };

    if (!ALLOWED_TRANSITIONS[collection]) {
      return NextResponse.json(
        { error: { code: 'INVALID_COLLECTION', message: `Collection '${collection}' cannot be updated via ops advance.` } },
        { status: 400 }
      );
    }

    if (!ALLOWED_TRANSITIONS[collection].includes(nextState)) {
      return NextResponse.json(
        { error: { code: 'INVALID_STATE', message: `State '${nextState}' is not permitted for ${collection}.` } },
        { status: 400 }
      );
    }

    // Always update in-memory cache
    statusOverrides.set(`${collection}:${id}`, nextState);

    // Try persisting to MongoDB
    try {
      const db = await getDb();
      const filter = ObjectId.isValid(id)
        ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
        : { _id: id };

      await db.collection(collection).updateOne(
        filter as any,
        {
          $set: {
            state: nextState,
            status: nextState,
            updatedAt: new Date(),
          },
          $push: {
            timeline: {
              state: nextState,
              actorId: session.userId || 'staff_ops',
              at: new Date(),
            },
          } as any,
        },
        { upsert: false }
      );
    } catch (dbErr) {
      console.warn('[ops/advance] DB update skipped, saved in-memory override:', dbErr);
    }

    return NextResponse.json({ success: true, id, nextState });
  } catch (err: any) {
    console.error('[ops/advance error]:', err);
    return NextResponse.json({ error: { code: 'ADVANCE_FAILED', message: err?.message || 'Failed to advance status' } }, { status: 500 });
  }
}
