import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || 'F2S-SAMPLE';
    const targetUrl = searchParams.get('url') || `${req.nextUrl.origin}/listing/${id}`;

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
