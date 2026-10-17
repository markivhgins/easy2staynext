import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const displayName = String(body.displayName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const emergencyContact = String(body.emergencyContact || '').trim();

    try {
      const db = await getDb();
      await db.collection('users').updateOne(
        { _id: new ObjectId(user._id) },
        {
          $set: {
            displayName,
            email,
            emergencyContact,
            updatedAt: new Date(),
          },
        }
      );
    } catch (dbErr) {
      console.warn('[api/me/profile] DB offline, updating session only:', dbErr);
    }

    const session = await getSession();
    session.name = displayName;
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
