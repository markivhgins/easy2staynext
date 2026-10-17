import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { memoryDrafts } from '@/lib/memoryDrafts';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || '').trim();
    const locality = String(body.locality || '').trim();
    const type = body.type === 'PG' ? 'PG' : 'FLAT';
    const rent = parseInt(body.rent || '0', 10);
    const deposit = parseInt(body.deposit || '0', 10);
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const consent = !!body.consent;

    if (!consent) {
      return NextResponse.json(
        { error: { code: 'CONSENT_REQUIRED', message: 'Consent is required to submit a property for verification.' } },
        { status: 400 }
      );
    }

    if (!title || rent <= 0) {
      return NextResponse.json(
        { error: { code: 'INVALID_FIELDS', message: 'Please provide a property name and valid monthly rent.' } },
        { status: 400 }
      );
    }

    if (!name || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: { code: 'INVALID_CONTACT', message: 'Enter your name and a 10-digit mobile number.' } },
        { status: 400 }
      );
    }

    const session = await getSession();
    let ownerId = session.userId || 'guest_unverified';
    const cleanPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;

    if (session.userId) {
      // User is verified via OTP — upgrade role to OWNER
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

    // Process photos: persist any base64 data to disk in public/uploads
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

    const draftId = new ObjectId();
    const draftRecord = {
      _id: draftId.toString(),
      ownerId: ownerId.toString(),
      name,
      phone: session.phone || phone,
      title,
      locality,
      type,
      gender: body.gender || 'any',
      occupancy: body.occupancy || 'single',
      bhk: body.bhk || '1 BHK',
      rent,
      deposit: deposit || rent,
      photos: savedPhotoUrls,
      status: 'SUBMITTED',
      createdAt: new Date(),
    };

    // Always push to in-memory store so it appears in admin queue immediately
    memoryDrafts.unshift(draftRecord);

    try {
      const db = await getDb();
      await db.collection('drafts').insertOne({
        ...draftRecord,
        _id: draftId,
      });
    } catch (dbErr) {
      console.warn('[drafts] MongoDB offline, stored in in-memory queue:', (dbErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      draftId: draftId.toString(),
      ownerDashboardUrl: '/owner',
      message: 'Property draft submitted for verification! Your listing is now registered in your Owner Dashboard.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: 'DRAFT_ERROR', message: (err as Error).message } },
      { status: 500 }
    );
  }
}
