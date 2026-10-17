import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { memoryDrafts } from '@/lib/memoryDrafts';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: { message: 'Authentication required' } }, { status: 401 });
    }

    const body = await req.json();
    const { draftId, photoUrls } = body;

    if (!draftId || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      return NextResponse.json({ error: { message: 'draftId and photoUrls array are required' } }, { status: 400 });
    }

    // 1. Update in memoryDrafts
    const memDraft = memoryDrafts.find((d) => d._id === draftId);
    if (memDraft) {
      memDraft.photos = [...(memDraft.photos || []), ...photoUrls];
    }

    // 2. Update in MongoDB
    try {
      const db = await getDb();
      let queryId: any;
      try {
        queryId = new ObjectId(draftId);
      } catch {
        queryId = draftId;
      }

      await db.collection('drafts').updateOne(
        { _id: queryId },
        {
          $addToSet: { photos: { $each: photoUrls } },
          $set: { updatedAt: new Date() },
        }
      );

      // Also if published as listing, update listings collection media
      if (memDraft && memDraft.status === 'PUBLISHED') {
        const listingSlug = `stay_${memDraft.locality ? memDraft.locality.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'noida'}_${draftId.toString().slice(-5)}`;
        await db.collection('listings').updateOne(
          { slug: listingSlug },
          {
            $addToSet: { media: { $each: photoUrls } },
            $set: { updatedAt: new Date() },
          }
        );
      }
    } catch (dbErr) {
      console.warn('[owner/photos] DB update warning:', (dbErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      message: `${photoUrls.length} photo(s) added successfully!`,
      photoUrls,
    });
  } catch (err) {
    return NextResponse.json({ error: { message: (err as Error).message } }, { status: 500 });
  }
}
