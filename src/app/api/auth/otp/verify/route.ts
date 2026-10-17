import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp, findOrCreateUser, getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestId = String(body.requestId || '').trim();
    const otp = String(body.otp || '').trim();

    if (!requestId || !otp) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_FIELDS',
            message: 'Both requestId and OTP are required.',
            requestId,
          },
        },
        { status: 400 }
      );
    }

    const verification = await verifyOtp(requestId, otp);

    if (!verification.success) {
      const messages: Record<string, string> = {
        EXPIRED: 'This verification code has expired. Please request a new one.',
        INVALID: 'Incorrect code. Please check and try again.',
        MAX_ATTEMPTS: 'Too many incorrect attempts. Please request a fresh code.',
        NOT_FOUND: 'Invalid verification session. Please request a new code.',
      };

      return NextResponse.json(
        {
          error: {
            code: verification.reason,
            message: messages[verification.reason] || 'Verification failed.',
            requestId,
          },
        },
        { status: 400 }
      );
    }

    // Find or create user record
    const { userId, roles, displayName } = await findOrCreateUser(verification.phone);

    // Save session
    const session = await getSession();
    session.userId = userId;
    session.roles = roles;
    session.phone = verification.phone;
    session.name = displayName;
    session.rotatedAt = Date.now();
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        roles,
        phone: verification.phone,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: 'VERIFICATION_ERROR',
          message: 'An unexpected error occurred during verification.',
          requestId: '',
        },
      },
      { status: 500 }
    );
  }
}
