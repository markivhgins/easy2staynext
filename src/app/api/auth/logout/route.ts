import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  session.destroy();

  // Handle reverse-proxy forwarded hosts safely to prevent internal port leaks (e.g. localhost:1000)
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return NextResponse.redirect(`${forwardedProto}://${forwardedHost}/`);
  }

  const host = req.headers.get('host');
  if (host && !host.includes('localhost:1000')) {
    const proto = host.includes('localhost') ? 'http' : 'https';
    return NextResponse.redirect(`${proto}://${host}/`);
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL));
  }

  return NextResponse.redirect(new URL('/', req.nextUrl.origin));
}

export async function POST() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
