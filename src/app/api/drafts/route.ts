import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { memoryDrafts, MemoryDraft } from '@/lib/memoryDrafts';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

function generatePropertyId(city: string): string {
  const cleanCity = (city || 'NOI').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'NOI';
  const randNum = Math.floor(10000 + Math.random() * 90000);
  return `F2S-${cleanCity}-${randNum}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('id');

    if (draftId) {
      const draft = memoryDrafts.find((d) => d._id === draftId || d.propertyId === draftId);
      if (draft) return NextResponse.json({ success: true, draft });

      try {
        const db = await getDb();
        let query: any = { propertyId: draftId };
        if (ObjectId.isValid(draftId)) query = { $or: [{ _id: new ObjectId(draftId) }, { propertyId: draftId }] };
        const dbDraft = await db.collection('drafts').findOne(query);
        if (dbDraft) return NextResponse.json({ success: true, draft: dbDraft });
      } catch {}

      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Property not found.' } }, { status: 404 });
    }

    const session = await getSession();
    const phone = session.phone || '';
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    const matches = memoryDrafts.filter(
      (d) =>
        (session.userId && d.ownerId === session.userId) ||
        (cleanPhone && d.phone && d.phone.replace(/\D/g, '').includes(cleanPhone))
    );

    return NextResponse.json({ success: true, drafts: matches });
  } catch (err) {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: (err as Error).message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'SUBMIT'; // 'SUBMIT' | 'SAVE_DRAFT' | 'CHECK_DUPLICATE'

    const title = String(body.title || '').trim();
    const city = String(body.city || 'Noida').trim();
    const locality = String(body.locality || '').trim();
    const fullAddress = String(body.fullAddress || '').trim();
    const phone = String(body.phone || '').trim();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // Duplicate Check Mode
    if (action === 'CHECK_DUPLICATE') {
      const memDup = memoryDrafts.find(
        (d) =>
          d._id !== body.draftId &&
          ((cleanPhone && d.phone?.replace(/\D/g, '').includes(cleanPhone) && (d.title?.toLowerCase() === title.toLowerCase() || d.locality?.toLowerCase() === locality.toLowerCase())) ||
            (fullAddress && d.fullAddress && d.fullAddress.toLowerCase() === fullAddress.toLowerCase()))
      );

      let isDuplicate = !!memDup;
      let matchedTitle = memDup?.title;
      let matchedId = memDup?.propertyId || memDup?._id;

      if (!isDuplicate) {
        try {
          const db = await getDb();
          const dbDup = await db.collection('drafts').findOne({
            $or: [
              { phone: { $regex: cleanPhone }, title: { $regex: `^${title}$`, $options: 'i' } },
              { fullAddress: { $regex: `^${fullAddress}$`, $options: 'i' } },
            ],
          });
          if (dbDup && dbDup._id?.toString() !== body.draftId) {
            isDuplicate = true;
            matchedTitle = dbDup.title;
            matchedId = dbDup.propertyId || dbDup._id?.toString();
          }
        } catch {}
      }

      return NextResponse.json({ isDuplicate, matchedTitle, matchedId });
    }

    const type = body.type || 'PG';
    const rent = parseInt(body.rent || '0', 10);
    const deposit = parseInt(body.deposit || '0', 10) || rent;
    const name = String(body.name || '').trim();
    const consent = !!body.consent;

    // Minimum validations
    if (action === 'SUBMIT') {
      if (!consent) {
        return NextResponse.json(
          { error: { code: 'CONSENT_REQUIRED', message: 'Authorization declaration and consent are required to submit your listing.' } },
          { status: 400 }
        );
      }
      if (!title || rent <= 0) {
        return NextResponse.json(
          { error: { code: 'INVALID_FIELDS', message: 'Please provide a property title and valid monthly rent.' } },
          { status: 400 }
        );
      }
      if (!name || cleanPhone.length !== 10) {
        return NextResponse.json(
          { error: { code: 'INVALID_CONTACT', message: 'Enter your full name and a valid 10-digit mobile number.' } },
          { status: 400 }
        );
      }
    } else if (action === 'SAVE_DRAFT') {
      if (!title && !name) {
        return NextResponse.json(
          { error: { code: 'INCOMPLETE_DRAFT', message: 'Please provide at least a property name or contact name to save draft.' } },
          { status: 400 }
        );
      }
    }

    const session = await getSession();
    let ownerId = session.userId || `guest_${Date.now()}`;

    if (session.userId) {
      if (!session.roles?.includes('OWNER')) {
        session.roles = [...(session.roles || ['USER']), 'OWNER'];
        await session.save();
      }
      try {
        const db = await getDb();
        if (ObjectId.isValid(session.userId)) {
          await db.collection('users').updateOne(
            { _id: new ObjectId(session.userId) },
            { $addToSet: { roleAssignments: 'OWNER' } }
          );
        }
      } catch {}
    }

    // Process uploaded photos: persist base64 data to /public/uploads
    const rawPhotos = Array.isArray(body.photos) ? body.photos : [];
    const savedPhotoUrls: string[] = [];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {}

    for (const p of rawPhotos) {
      if (typeof p !== 'string') continue;
      if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/uploads/')) {
        savedPhotoUrls.push(p);
        continue;
      }
      const b64Match = p.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (b64Match) {
        try {
          const rawExt = b64Match[1].toLowerCase();
          const ext = rawExt === 'jpeg' ? '.jpg' : `.${rawExt}`;
          const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
          const filename = `prop_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${safeExt}`;
          const filePath = path.join(uploadsDir, filename);
          await fs.writeFile(filePath, Buffer.from(b64Match[2], 'base64'));
          savedPhotoUrls.push(`/uploads/${filename}`);
        } catch {
          savedPhotoUrls.push(p);
        }
      } else {
        savedPhotoUrls.push(p);
      }
    }

    const existingDraftId = body.draftId;
    let draftId = existingDraftId ? existingDraftId : new ObjectId().toString();
    const propertyId = body.propertyId || generatePropertyId(city);

    const recordStatus = action === 'SAVE_DRAFT' ? 'DRAFT' : 'SUBMITTED';

    const draftRecord: MemoryDraft = {
      _id: draftId,
      propertyId,
      ownerId: ownerId.toString(),
      name,
      phone: session.phone || (cleanPhone ? `+91${cleanPhone}` : phone),
      whatsapp: body.whatsapp || '',
      email: body.email || '',
      userType: body.userType || 'Individual Property Owner',
      authorisationConfirmed: !!body.authorisationConfirmed || consent,
      title,
      locality,
      city,
      fullAddress,
      landmark: body.landmark || '',
      nearbyMetroOrCollege: body.nearbyMetroOrCollege || '',
      hideExactAddress: !!body.hideExactAddress,
      coordinates: body.coordinates || [77.391, 28.5355],
      type,
      bhk: body.bhk || '1 BHK',
      furnishing: body.furnishing || 'Furnished',
      sharing: body.sharing || 'Single',
      suitableFor: body.suitableFor || 'Boys',
      coupleFriendly: !!body.coupleFriendly,
      coupleConditions: body.coupleConditions || '',
      bathroomType: body.bathroomType || 'Attached',
      kitchenAvailable: body.kitchenAvailable !== undefined ? !!body.kitchenAvailable : true,
      totalRooms: Number(body.totalRooms) || 1,
      availableRooms: Number(body.availableRooms) || 1,
      roomSize: body.roomSize || '',
      rent,
      deposit,
      maintenance: Number(body.maintenance) || 0,
      electricityBasis: body.electricityBasis || 'METERED',
      brokerage: Number(body.brokerage) || 0,
      minimumStay: body.minimumStay || '1 Month',
      noticePeriod: body.noticePeriod || '1 Month',
      availableFrom: body.availableFrom || '',
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      visitorsPolicy: body.visitorsPolicy || 'Allowed (Daytime)',
      petsPolicy: body.petsPolicy || 'Not Allowed',
      smokingPolicy: body.smokingPolicy || 'Strictly Prohibited',
      houseRules: body.houseRules || '',
      photos: savedPhotoUrls,
      photosCategorized: Array.isArray(body.photosCategorized) ? body.photosCategorized : [],
      videoUrl: body.videoUrl || '',
      status: recordStatus,
      availabilityStatus: 'AVAILABLE',
      createdAt: new Date(),
    };

    // Update in memory queue if already exists, else insert at top
    const existingIndex = memoryDrafts.findIndex((d) => d._id === draftId || d.propertyId === propertyId);
    if (existingIndex >= 0) {
      memoryDrafts[existingIndex] = { ...memoryDrafts[existingIndex], ...draftRecord };
    } else {
      memoryDrafts.unshift(draftRecord);
    }

    try {
      const db = await getDb();
      let queryId: any;
      try {
        queryId = new ObjectId(draftId);
      } catch {
        queryId = draftId;
      }

      await db.collection('drafts').updateOne(
        { $or: [{ _id: queryId }, { propertyId }] },
        { $set: draftRecord },
        { upsert: true }
      );
    } catch (dbErr) {
      console.warn('[drafts] MongoDB offline, stored in in-memory queue:', (dbErr as Error).message);
    }

    const message =
      action === 'SAVE_DRAFT'
        ? `Draft saved successfully! You can resume editing anytime using Property ID ${propertyId}.`
        : `Property ${propertyId} submitted for verification! Our field operations team will coordinate the physical inspection.`;

    return NextResponse.json({
      success: true,
      draftId,
      propertyId,
      status: recordStatus,
      ownerDashboardUrl: '/owner',
      message,
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: 'DRAFT_ERROR', message: (err as Error).message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('id');
    if (!draftId) {
      return NextResponse.json({ error: { code: 'MISSING_ID', message: 'draftId is required.' } }, { status: 400 });
    }

    const memIdx = memoryDrafts.findIndex((d) => d._id === draftId || d.propertyId === draftId);
    if (memIdx >= 0) {
      memoryDrafts.splice(memIdx, 1);
    }

    try {
      const db = await getDb();
      let queryId: any;
      try {
        queryId = new ObjectId(draftId);
      } catch {
        queryId = draftId;
      }
      await db.collection('drafts').deleteOne({ $or: [{ _id: queryId }, { propertyId: draftId }] });
    } catch {}

    return NextResponse.json({ success: true, message: 'Property listing deleted.' });
  } catch (err) {
    return NextResponse.json({ error: { code: 'DELETE_ERROR', message: (err as Error).message } }, { status: 500 });
  }
}
