// app/api/uploadZip/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';

// We need to use Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return NextResponse.json({ success: false, error: 'No boundary found in headers' }, { status: 400 });
    }

    const reader = request.body?.getReader();
    if (!reader) {
      return NextResponse.json({ success: false, error: 'No body found' }, { status: 400 });
    }

    // Parse the multipart/form-data
    const busboy = await import('busboy');
    const bb = busboy.default({ headers: { 'content-type': contentType } });

    const uploadDir = path.join(process.cwd(), 'src', 'data', 'uploadedZip');
    fs.mkdirSync(uploadDir, { recursive: true });

    let fileName = '';
    let filePath = '';
    let fileWriteStream: fs.WriteStream;

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      if (!filename.endsWith('.zip')) {
        return NextResponse.json({ success: false, error: 'Uploaded file is not a ZIP archive' }, { status: 400 });
      }
      const timestamp = Date.now();
      const sanitizedFilename = filename.replace(/\s+/g, '_');
      fileName = `${timestamp}-${sanitizedFilename}`;
      filePath = path.join(uploadDir, fileName);
      fileWriteStream = createWriteStream(filePath);
      file.pipe(fileWriteStream);
    });

    bb.on('close', () => {
      const relativePath = `/src/data/uploadedZip/${fileName}`;
      return NextResponse.json({ success: true, path: relativePath }, { status: 200 });
    });

    const stream = request.body as ReadableStream;
    const { readable, writable } = new TransformStream();
    stream.pipeTo(writable);
    const bodyStream = readable as any;
    bodyStream.pipe(bb);

    return new Promise((resolve) => {
      bb.on('finish', () => {
        resolve(
          NextResponse.json({ success: true, path: `/src/data/uploadedZip/${fileName}` }, { status: 200 })
        );
      });
    });
  } catch (error) {
    console.error('Error processing the upload', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
