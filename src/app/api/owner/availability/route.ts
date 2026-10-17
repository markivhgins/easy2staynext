import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { memoryDrafts } from '@/lib/memoryDrafts';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.phone) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Please sign in to update listing availability.' } },
        { status: 401 }
      );
    }

    const { draftId, status } = await req.json();
    if (!draftId || !['AVAILABLE', 'OCCUPIED'].includes(status)) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Valid draftId and status (AVAILABLE | OCCUPIED) required.' } },
        { status: 400 }
      );
    }

    // 1. Update in memory drafts if present
    const memDraft = memoryDrafts.find((d) => d._id?.toString() === draftId);
    if (memDraft) {
      (memDraft as any).availabilityStatus = status;
    }

    // 2. Persist to MongoDB if available
    try {
      const db = await getDb();
      const filter = ObjectId.isValid(draftId)
        ? { _id: new ObjectId(draftId) }
        : { _id: draftId };

      const updateResult = await db.collection('drafts').updateOne(
        filter as any,
        {
          $set: {
            availabilityStatus: status,
            'availability.status': status === 'AVAILABLE' ? 'AVAILABLE' : 'UNAVAILABLE',
            'availability.confirmedAt': new Date(),
            updatedAt: new Date(),
          },
        }
      );

      // If there is an associated public listing with this draft or phone, update it too
      await db.collection('listings').updateMany(
        { 'contact.phone': session.phone },
        {
          $set: {
            'availability.status': status === 'AVAILABLE' ? 'AVAILABLE' : 'UNAVAILABLE',
            'availability.confirmedAt': new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } catch (dbErr) {
      console.warn('[owner/availability] Database write skipped, memory updated:', dbErr);
    }

    return NextResponse.json({
      success: true,
      draftId,
      status,
      message: `Availability updated to ${status === 'AVAILABLE' ? 'Vacant / Available' : 'Occupied'}.`,
    });
  } catch (err: any) {
    console.error('[owner/availability error]:', err);
    return NextResponse.json(
      { error: { code: 'UPDATE_FAILED', message: err?.message || 'Failed to update availability.' } },
      { status: 500 }
    );
  }
}
