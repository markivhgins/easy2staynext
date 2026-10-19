import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getListingBySlug } from '@/lib/listings';
import { ObjectId } from 'mongodb';
import { randomBytes } from 'crypto';
import { memoryEnquiries } from '@/lib/memoryEnquiries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body.slug || body.listingId || '').trim();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const kind = body.kind === 'CALLBACK' ? 'CALLBACK' : 'VISIT';
    const slot = body.slot ? String(body.slot).trim() : undefined;
    const consent = !!body.consent;

    if (!consent) {
      return NextResponse.json(
        {
          error: {
            code: 'CONSENT_REQUIRED',
            message: 'Explicit consent is required before contact details can be shared.',
            requestId: '',
          },
        },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    if (cleanName.length < 2 || !/[a-zA-Z]/.test(cleanName)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_NAME',
            message: 'Please provide a valid full name (minimum 2 characters).',
            requestId: '',
          },
        },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone) || /^([0-9])\1{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PHONE',
            message: 'Please provide a genuine 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
            requestId: '',
          },
        },
        { status: 400 }
      );
    }

    if (kind === 'VISIT') {
      if (!slot) {
        return NextResponse.json(
          {
            error: {
              code: 'SLOT_REQUIRED',
              message: 'A preferred date and time is required to schedule a property visit.',
              requestId: '',
            },
          },
          { status: 400 }
        );
      }

      const slotDate = new Date(slot);
      if (isNaN(slotDate.getTime())) {
        return NextResponse.json(
          {
            error: {
              code: 'INVALID_SLOT',
              message: 'Invalid date/time format provided.',
              requestId: '',
            },
          },
          { status: 400 }
        );
      }

      // Slot must be at least 15 minutes in future
      if (slotDate.getTime() < Date.now() + 15 * 60 * 1000) {
        return NextResponse.json(
          {
            error: {
              code: 'PAST_SLOT',
              message: 'Preferred visit date and time must be in the future.',
              requestId: '',
            },
          },
          { status: 400 }
        );
      }

      // Slot hours must be between 8:00 AM and 8:00 PM
      const hours = slotDate.getHours();
      if (hours < 8 || hours >= 20) {
        return NextResponse.json(
          {
            error: {
              code: 'OUTSIDE_HOURS',
              message: 'Visiting hours are between 8:00 AM and 8:00 PM.',
              requestId: '',
            },
          },
          { status: 400 }
        );
      }
    }

    const listing = await getListingBySlug(slug);
    if (!listing) {
      return NextResponse.json(
        {
          error: {
            code: 'LISTING_NOT_FOUND',
            message: 'The requested listing is no longer available.',
            requestId: '',
          },
        },
        { status: 404 }
      );
    }

    const session = await getSession();
    const userId = session.userId ? new ObjectId(session.userId) : 'guest';
    const requestId = `ENQ-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const idempotencyKey = `${slug}-${phone}-${kind}-${slot || 'none'}`;

    try {
      const db = await getDb();
      // 1. Record explicit consent
      const consentDoc = {
        _id: new ObjectId(),
        userId,
        purpose: kind === 'VISIT' ? 'PROPERTY_VISIT_COORDINATION' : 'CALLBACK_REQUEST',
        noticeVersion: 'v2.0-consent',
        recipientType: 'OPERATIONS',
        dataFieldsShared: ['name', 'phone', ...(slot ? ['preferredSlot'] : [])],
        requestId,
        grantedAt: new Date(),
      };
      await db.collection('consentRecords').insertOne(consentDoc);

      // 2. Insert or update enquiry (idempotent)
      const enquiryDoc = {
        _id: new ObjectId(),
        requestId,
        idempotencyKey,
        userId,
        listingId: listing._id,
        listingSlug: listing.slug,
        listingTitle: listing.title,
        name: cleanName,
        phone: cleanPhone,
        kind,
        preferredSlot: slot,
        priceSnapshot: listing.price,
        consentRecordId: consentDoc._id,
        state: 'REQUESTED',
        timeline: [
          {
            state: 'REQUESTED',
            actorId: String(userId),
            at: new Date(),
            note: `Requested ${kind.toLowerCase()} from listing page`,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Always persist in memory queue
      memoryEnquiries.unshift(enquiryDoc);

      await db.collection('enquiries').insertOne(enquiryDoc);
    } catch (dbErr) {
      console.warn('[enquiries] DB offline, logged enquiry in local session:', (dbErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Request submitted successfully.',
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: 'ENQUIRY_FAILED',
          message: 'Unable to process your request. Please try again.',
          requestId: '',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in required.' } }, { status: 401 });
  }

  const db = await getDb();
  const list = await db
    .collection('enquiries')
    .find({ userId: new ObjectId(session.userId) })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ data: list });
}
