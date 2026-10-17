import { NextResponse } from 'next/server';
import { checkReady } from '@/lib/db';

export async function GET() {
  try {
    await checkReady();
    return NextResponse.json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'unavailable',
        error: 'Database connection failed',
        details: (err as Error).message,
      },
      { status: 503 }
    );
  }
}
