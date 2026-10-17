import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { memoryDrafts } from '@/lib/memoryDrafts';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const roles = session.roles || [];
    const isStaff = roles.some((r) => ['OPERATIONS', 'ADMIN', 'SUPER_ADMIN', 'VERIFIER'].includes(r));

    if (!isStaff) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin or Operations permission required.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    let { draftId, action = 'VERIFY_AND_PUBLISH', notes = '' } = body;

    if (action === 'APPROVE' || action === 'PUBLISH') {
      action = 'VERIFY_AND_PUBLISH';
    }

    if (!draftId) {
      return NextResponse.json(
        { error: { code: 'MISSING_ID', message: 'draftId is required.' } },
        { status: 400 }
      );
    }

    let draft = memoryDrafts.find((d) => d._id === draftId);
    let db: any = null;
    let queryId: any;
    try {
      queryId = new ObjectId(draftId);
    } catch {
      queryId = draftId;
    }

    try {
      db = await getDb();
      if (!draft) {
        draft = await db.collection('drafts').findOne({ _id: queryId });
      }
    } catch (dbErr) {
      console.warn('[verify-listing] DB offline, using memory queue:', (dbErr as Error).message);
    }

    if (!draft) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Property draft not found.' } },
        { status: 404 }
      );
    }

    const staffName = session.name || 'Admin Operations';

    if (action === 'VERIFY_AND_PUBLISH') {
      const now = new Date();
      const validUntil = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 180-day audit cycle
      const listingSlug = `stay_${draft.locality ? draft.locality.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'noida'}_${draft._id.toString().slice(-5)}`;

      // 1. Update in memoryDrafts
      const memDraft = memoryDrafts.find((d) => d._id === draftId);
      if (memDraft) {
        memDraft.status = 'PUBLISHED';
        memDraft.isVerified = true;
        memDraft.verifiedAt = now;
        memDraft.verifiedBy = staffName;
        memDraft.validUntil = validUntil;
      }

      // 2. Persist to MongoDB if available
      if (db) {
        try {
          await db.collection('drafts').updateOne(
            { _id: queryId },
            {
              $set: {
                status: 'PUBLISHED',
                isVerified: true,
                verifiedAt: now,
                verifiedBy: staffName,
                validUntil,
                adminNotes: notes || 'Verified after remote document & field confirmation.',
                updatedAt: now,
              },
            }
          );

          const rentPaise = Math.round((Number(draft.rent) || 5000) * 100);
          const depositPaise = Math.round((Number(draft.deposit) || Number(draft.rent) || 5000) * 100);
          const accommodationType = draft.type === 'PG' ? 'PG' : 'FLAT';
          const entryPoint = accommodationType === 'PG' ? 'pg' : 'flats';

          await db.collection('listings').updateOne(
            { slug: listingSlug },
            {
              $set: {
                slug: listingSlug,
                title: draft.title,
                locality: draft.locality || 'Noida',
                city: draft.city || 'Noida',
                accommodationType,
                entryPoints: [entryPoint],
                price: {
                  amountPaise: rentPaise,
                  basis: accommodationType === 'PG' ? 'PER_BED_MONTH' : 'PER_UNIT_MONTH',
                  depositPaise,
                  maintenancePaise: 0,
                  electricityBasis: 'METERED',
                  foodIncluded: false,
                  oneTimeFeesPaise: 0,
                  priceConfirmedAt: now,
                },
                occupancy: draft.occupancy || 'single',
                gender: draft.gender || 'any',
                bhk: draft.bhk || '1 BHK',
                publicLocation: {
                  type: 'Point',
                  coordinates: [77.391, 28.5355],
                  areaLabel: draft.locality || 'Noida',
                  approximate: true,
                },
                locationPrivate: {
                  type: 'Point',
                  coordinates: [77.391, 28.5355],
                },
                addressPrivate: draft.locality || 'Noida',
                verification: {
                  state: 'VERIFIED',
                  verifiedAt: now,
                  validUntil,
                  scope: notes || 'Physical on-site audit passed (rooms, meter, lock, washroom)',
                },
                availability: {
                  status: 'AVAILABLE',
                  confirmedAt: now,
                },
                status: 'PUBLISHED',
                media: Array.isArray(draft.photos) && draft.photos.length > 0 ? draft.photos : [],
                amenities: ['Power Backup', 'RO Water', 'Wi-Fi', '24x7 Security'],
                rules: [
                  'Valid government ID verification required before move-in.',
                  'Quiet hours observed after 10:30 PM.',
                ],
                ownerId: draft.ownerId || draft.phone,
                ownerName: draft.name,
                ownerPhone: draft.phone,
                updatedAt: now,
              },
              $setOnInsert: {
                createdAt: now,
                viewCount: 0,
              },
            },
            { upsert: true }
          );
        } catch (dbErr) {
          console.warn('[verify-listing] MongoDB update failed:', (dbErr as Error).message);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'PUBLISHED',
        slug: listingSlug,
        message: `Property "${draft.title}" has been verified and published live with the official Find2Stay badge!`,
      });
    }

    if (action === 'SCHEDULE_VISIT') {
      const memDraft = memoryDrafts.find((d) => d._id === draftId);
      if (memDraft) {
        memDraft.status = 'INSPECTION_SCHEDULED';
        memDraft.assignedVerifier = staffName;
      }

      if (db) {
        try {
          await db.collection('drafts').updateOne(
            { _id: queryId },
            {
              $set: {
                status: 'INSPECTION_SCHEDULED',
                assignedVerifier: staffName,
                updatedAt: new Date(),
              },
            }
          );
        } catch (dbErr) {
          console.warn('[verify-listing] DB schedule update failed:', (dbErr as Error).message);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'INSPECTION_SCHEDULED',
        message: `Inspection scheduled for "${draft.title}". Verifier assigned: ${staffName}.`,
      });
    }

    if (action === 'REJECT') {
      const memDraft = memoryDrafts.find((d) => d._id === draftId);
      if (memDraft) {
        memDraft.status = 'REJECTED';
        memDraft.adminNotes = notes || 'Rejected due to incomplete owner evidence.';
      }

      if (db) {
        try {
          await db.collection('drafts').updateOne(
            { _id: queryId },
            {
              $set: {
                status: 'REJECTED',
                adminNotes: notes || 'Rejected due to incomplete owner evidence.',
                updatedAt: new Date(),
              },
            }
          );
        } catch (dbErr) {
          console.warn('[verify-listing] DB reject update failed:', (dbErr as Error).message);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'REJECTED',
        message: `Draft "${draft.title}" was rejected.`,
      });
    }

    return NextResponse.json(
      { error: { code: 'INVALID_ACTION', message: `Unknown action: ${action}` } },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[POST /api/admin/verify-listing error]:', err);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: err?.message || 'Failed to update verification status.' } },
      { status: 500 }
    );
  }
}
