import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { randomBytes } from 'crypto';

// Resilient in-memory store for service connection leads
declare global {
  // eslint-disable-next-line no-var
  var _f2sMemoryConnections: any[] | undefined;
}
if (!global._f2sMemoryConnections) {
  global._f2sMemoryConnections = [];
}
export const memoryConnections = global._f2sMemoryConnections;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = String(body.service || '').trim();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const consent = !!body.consent;

    if (!['food', 'water', 'movers'].includes(service)) {
      return NextResponse.json(
        { error: { code: 'INVALID_SERVICE', message: 'Unknown service type.' } },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: { code: 'CONSENT_REQUIRED', message: 'Consent is required to share contact details with vetted partners.' } },
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
    const userId = session.userId ? new ObjectId(session.userId) : 'guest';
    const requestId = `SVC-${service.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;

    const connectionDoc = {
      _id: new ObjectId(),
      requestId,
      serviceType: service,
      userId,
      name,
      phone,
      serviceDetails: body.details || {},
      state: 'ROUTING',
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 1. Always save to in-memory queue
    memoryConnections.unshift(connectionDoc);

    // 2. Persist to MongoDB if available
    try {
      const db = await getDb();

      const consentDoc = {
        _id: new ObjectId(),
        userId,
        purpose: `SERVICE_CONNECTION_${service.toUpperCase()}`,
        noticeVersion: 'v2.0-service-consent',
        recipientType: 'PROVIDER',
        dataFieldsShared: ['name', 'phone', 'serviceDetails'],
        requestId,
        grantedAt: new Date(),
      };

      await db.collection('consentRecords').insertOne(consentDoc);
      await db.collection('serviceConnections').insertOne(connectionDoc);
    } catch (dbErr) {
      console.warn('[connections] MongoDB offline, stored in memory queue:', (dbErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Service connection request initiated. Our operations team is routing it to vetted providers.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: 'SERVICE_ERROR', message: (err as Error).message } },
      { status: 500 }
    );
  }
}
