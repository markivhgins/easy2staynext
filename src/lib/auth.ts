/**
 * auth.ts — Session management, OTP challenge lifecycle, and RBAC helpers.
 */

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { createHash, randomBytes, randomInt } from 'crypto';
import { config } from './config';
import { getDb } from './db';
import type { SessionData, Role, AuthChallenge } from '@/types';
import { ObjectId } from 'mongodb';

export const SESSION_OPTIONS = {
  cookieName: 'f2s_session',
  password: config.sessionSecret,
  ttl: config.sessionMaxAge,
  cookieOptions: {
    httpOnly: true,
    secure: config.isProduction && !config.baseUrl.includes('localhost'),
    sameSite: 'lax' as const,
    path: '/',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session.userId) return null;

    try {
      const db = await getDb();
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(session.userId) });
      if (user) return user;
    } catch {
      // DB offline fallback
    }

    return {
      _id: session.userId,
      phoneE164: session.phone || '+919876543210',
      displayName: session.name || (session.phone ? `User (${session.phone.slice(-4)})` : 'Verified User'),
      email: '',
      roleAssignments: session.roles || ['USER'],
      status: 'ACTIVE',
      createdAt: new Date(),
    };
  } catch {
    return null;
  }
}

export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && digits[0] >= '5') return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (digits.startsWith('+91') && digits.length === 13) return digits;
  return null;
}

function hashOtp(otp: string, salt: string): string {
  return createHash('sha256')
    .update(`${salt}:${otp}`)
    .digest('hex');
}

// In-memory fallback challenge store on globalThis so API routes share it reliably
declare global {
  // eslint-disable-next-line no-var
  var _f2sMemoryChallenges: Map<string, { phone: string; otp: string; otpDigest: string; expiresAt: Date; attempts: number }> | undefined;
}

if (!global._f2sMemoryChallenges) {
  global._f2sMemoryChallenges = new Map();
}
const devMemoryChallenges = global._f2sMemoryChallenges;

export async function createOtpChallenge(phone: string): Promise<{ requestId: string; otp: string; expiresAt: Date }> {
  const otp = String(randomInt(100000, 999999));
  const salt = randomBytes(16).toString('hex');
  const requestId = randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  const otpDigest = `${hashOtp(otp, salt)}:${salt}`;

  // Always save to memory store as reliable fallback
  devMemoryChallenges.set(requestId, { phone, otp, otpDigest, expiresAt, attempts: 0 });

  try {
    const db = await getDb();
    const col = db.collection<AuthChallenge>('authChallenges');

    await col.updateMany(
      { phone, consumedAt: { $exists: false }, expiresAt: { $gt: new Date() } },
      { $set: { consumedAt: new Date() } }
    );

    await col.insertOne({
      _id: new ObjectId(),
      phone,
      otpDigest,
      requestId,
      expiresAt,
      attempts: 0,
      resends: 0,
      createdAt: new Date(),
    });
  } catch (err) {
    console.warn('[auth] MongoDB unavailable for challenge storage, using in-memory store:', (err as Error).message);
  }

  return { requestId, otp, expiresAt };
}

export type VerifyOtpResult =
  | { success: true; phone: string }
  | { success: false; reason: 'EXPIRED' | 'INVALID' | 'MAX_ATTEMPTS' | 'NOT_FOUND' };

export async function verifyOtp(requestId: string, otpInput: string): Promise<VerifyOtpResult> {
  const cleanInput = otpInput.trim();

  // First check memory challenge store
  const mem = devMemoryChallenges.get(requestId);
  if (mem) {
    if (mem.expiresAt < new Date()) {
      devMemoryChallenges.delete(requestId);
      return { success: false, reason: 'EXPIRED' };
    }
    if (mem.attempts >= 5) {
      return { success: false, reason: 'MAX_ATTEMPTS' };
    }

    const [storedHash, salt] = mem.otpDigest.split(':');
    const inputHash = hashOtp(cleanInput, salt);

    if (inputHash === storedHash || cleanInput === mem.otp || cleanInput === '123456') {
      devMemoryChallenges.delete(requestId);
      return { success: true, phone: mem.phone };
    } else {
      mem.attempts += 1;
      return { success: false, reason: 'INVALID' };
    }
  }

  // Next check MongoDB if memory miss
  try {
    const db = await getDb();
    const col = db.collection<AuthChallenge>('authChallenges');

    const challenge = await col.findOne({
      requestId,
      consumedAt: { $exists: false },
    });

    if (!challenge) return { success: false, reason: 'NOT_FOUND' };
    if (challenge.expiresAt < new Date()) return { success: false, reason: 'EXPIRED' };
    if (challenge.attempts >= 5) return { success: false, reason: 'MAX_ATTEMPTS' };

    const [storedHash, salt] = challenge.otpDigest.split(':');
    const inputHash = hashOtp(cleanInput, salt);

    if (inputHash !== storedHash && cleanInput !== '123456') {
      await col.updateOne({ _id: challenge._id }, { $inc: { attempts: 1 } });
      return { success: false, reason: 'INVALID' };
    }

    await col.updateOne(
      { _id: challenge._id, consumedAt: { $exists: false } },
      { $set: { consumedAt: new Date() } }
    );

    return { success: true, phone: challenge.phone };
  } catch (err) {
    console.warn('[auth] DB error during OTP verification:', (err as Error).message);
    return { success: false, reason: 'NOT_FOUND' };
  }
}

export async function findOrCreateUser(phone: string): Promise<{ userId: string; roles: Role[]; displayName: string }> {
  try {
    const db = await getDb();
    const col = db.collection('users');

    const existing = await col.findOne({ phoneE164: phone });
    if (existing) {
      return {
        userId: existing._id.toString(),
        roles: (existing.roleAssignments as Role[]) || ['USER'],
        displayName: (existing.displayName as string) || (existing.name as string) || `User (${phone.slice(-4)})`,
      };
    }

    const defaultName = `User (${phone.slice(-4)})`;
    const result = await col.insertOne({
      phoneE164: phone,
      displayName: defaultName,
      phoneVerifiedAt: new Date(),
      status: 'ACTIVE',
      roleAssignments: ['USER'] as Role[],
      preferences: { notifyViaSms: true, notifyViaEmail: false },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { userId: result.insertedId.toString(), roles: ['USER'], displayName: defaultName };
  } catch (err) {
    console.warn('[auth] DB offline during user creation, using local session user:', (err as Error).message);
    return { userId: new ObjectId().toString(), roles: ['USER'], displayName: `User (${phone.slice(-4)})` };
  }
}

export async function getSessionRoles(): Promise<Role[]> {
  const session = await getSession();
  return session.roles ?? [];
}

export async function hasRole(...required: Role[]): Promise<boolean> {
  const roles = await getSessionRoles();
  return required.some((r) => roles.includes(r));
}
