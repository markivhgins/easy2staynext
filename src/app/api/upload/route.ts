import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // 1. Multipart Form Data Upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const uploadedUrls: string[] = [];

      for (const [key, value] of formData.entries()) {
        if (value && typeof value === 'object' && 'arrayBuffer' in value) {
          const file = value as File;
          const ext = path.extname(file.name).toLowerCase() || '.jpg';
          const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
          const filename = `f2s_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${safeExt}`;
          const filePath = path.join(uploadsDir, filename);

          const bytes = await file.arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(bytes));
          uploadedUrls.push(`/uploads/${filename}`);
        }
      }

      if (uploadedUrls.length === 0) {
        return NextResponse.json({ error: { message: 'No valid image files provided' } }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        urls: uploadedUrls,
        url: uploadedUrls[0],
      });
    }

    // 2. Base64 JSON Upload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const rawImages: string[] = Array.isArray(body.images) ? body.images : body.image ? [body.image] : [];

      if (rawImages.length === 0) {
        return NextResponse.json({ error: { message: 'No image data provided' } }, { status: 400 });
      }

      const uploadedUrls: string[] = [];

      for (const imgStr of rawImages) {
        if (typeof imgStr !== 'string') continue;

        // If it's already a URL, preserve it
        if (imgStr.startsWith('http://') || imgStr.startsWith('https://') || imgStr.startsWith('/uploads/')) {
          uploadedUrls.push(imgStr);
          continue;
        }

        // Parse base64
        const matches = imgStr.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt === 'jpeg' ? '.jpg' : `.${rawExt}`;
          const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          const filename = `f2s_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${safeExt}`;
          const filePath = path.join(uploadsDir, filename);
          await fs.writeFile(filePath, buffer);
          uploadedUrls.push(`/uploads/${filename}`);
        } else {
          // If plain URL or string
          uploadedUrls.push(imgStr);
        }
      }

      return NextResponse.json({
        success: true,
        urls: uploadedUrls,
        url: uploadedUrls[0],
      });
    }

    return NextResponse.json({ error: { message: 'Unsupported Content-Type' } }, { status: 400 });
  } catch (err) {
    console.error('[upload] Error saving image:', err);
    return NextResponse.json({ error: { message: (err as Error).message } }, { status: 500 });
  }
}
