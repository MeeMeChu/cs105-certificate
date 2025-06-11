// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { writeFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size (25MB limit)
    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Create date-based folder structure (YYYY/MM/DD)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateFolder = `${year}/${month}/${day}`;

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // Create uploads directory with date structure if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads', dateFolder);
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const targetPath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(targetPath, buffer);

    const imageUrl = `/uploads/${dateFolder}/${filename}`;
    // const fullUrl = `${req.nextUrl.origin}${imageUrl}`;

    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      filename: filename,
      size: file.size,
      type: file.type,
      path: `${dateFolder}/${filename}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
