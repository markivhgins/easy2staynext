import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const topic = String(body.topic || 'General').trim();
    const message = String(body.message || '').trim();

    if (!name || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: { code: 'INVALID_CONTACT', message: 'Enter your name and a 10-digit mobile number.' } },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { error: { code: 'SHORT_MESSAGE', message: 'Please describe how we can assist you.' } },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection('messages').insertOne({
      _id: new ObjectId(),
      name,
      phone,
      email,
      topic,
      message,
      createdAt: new Date(),
    });

    // Notify operations team via email if SMTP is configured
    const opsInbox = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'operations@find2stay.in';
    await sendEmail({
      to: opsInbox,
      replyTo: email || undefined,
      subject: `[Find2Stay Inquiry] ${topic} from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nTopic: ${topic}\n\nMessage:\n${message}`,
    }).catch((emailErr) => {
      console.warn('[contact] Notification email failed to send:', (emailErr as Error).message);
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received by our operations team. We will respond within 24 hours.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: 'CONTACT_ERROR', message: (err as Error).message } },
      { status: 500 }
    );
  }
}
