import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { memoryDrafts } from '@/lib/memoryDrafts';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || 'F2S-SAMPLE';
    const targetUrl = searchParams.get('url') || `${req.nextUrl.origin}/listing/${id}`;

    // Main Specification Requirement: QR codes should only be generated for verified listings.
    if (id && id !== 'F2S-SAMPLE' && !id.startsWith('demo')) {
      const memDraft = memoryDrafts.find((d) => d.propertyId === id || d._id === id);
      if (memDraft && !memDraft.isVerified && memDraft.status !== 'PUBLISHED') {
        return NextResponse.json(
          { error: { code: 'UNVERIFIED_LISTING', message: 'QR codes are generated exclusively for verified listings following the on-site physical inspection audit.' } },
          { status: 403 }
        );
      }

      try {
        const db = await getDb();
        const dbDraft = await db.collection('drafts').findOne({ propertyId: id });
        if (dbDraft && !dbDraft.isVerified && dbDraft.status !== 'PUBLISHED') {
          return NextResponse.json(
            { error: { code: 'UNVERIFIED_LISTING', message: 'QR codes are generated exclusively for verified listings following the on-site physical inspection audit.' } },
            { status: 403 }
          );
        }
      } catch {}
    }

    // Generate high-resolution Data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    return NextResponse.json({
      success: true,
      propertyId: id,
      targetUrl,
      qrDataUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: 'QR_GENERATION_FAILED', message: (err as Error).message } },
      { status: 500 }
    );
  }
}
