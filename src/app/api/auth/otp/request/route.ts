import { NextRequest, NextResponse } from 'next/server';
import { normalisePhone, createOtpChallenge } from '@/lib/auth';
import { config } from '@/lib/config';
import { sendOtpSms } from '@/lib/sms';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = String(body.phone || '').trim();

    const phone = normalisePhone(rawPhone);
    if (!phone) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PHONE',
            message: 'Please provide a valid 10-digit Indian mobile number.',
            requestId: '',
          },
        },
        { status: 400 }
      );
    }

    const { requestId, otp, expiresAt } = await createOtpChallenge(phone);

    // Dispatch SMS via configured provider (Fast2SMS, Twilio, MSG91, or Console)
    const smsResult = await sendOtpSms(phone, otp);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AUTH OTP DISPATCHED] Phone: ${phone} | Request ID: ${requestId}`);
    }

    // Mask phone for display: +91 98*** **210
    const masked = `${phone.slice(0, 5)}*** **${phone.slice(-3)}`;

    // NEVER return OTP in production or when VERCEL_ENV/NODE_ENV is set to production
    const isProduction =
      process.env.NODE_ENV === 'production' ||
      process.env.VERCEL_ENV === 'production' ||
      process.env.RENDER === 'true';

    const showDevOtp = !isProduction && (process.env.ALLOW_DEV_OTP === 'true' || config.otpProvider === 'console');

    return NextResponse.json({
      success: true,
      requestId,
      maskedPhone: masked,
      expiresAt: expiresAt.toISOString(),
      devOtp: showDevOtp ? otp : undefined,
    });
  } catch (err: any) {
    console.error('[api/auth/otp/request error]:', err);
    return NextResponse.json(
      {
        error: {
          code: 'OTP_REQUEST_FAILED',
          message: err?.message || 'Unable to issue verification code. Please try again.',
          requestId: '',
        },
      },
      { status: 500 }
    );
  }
}
