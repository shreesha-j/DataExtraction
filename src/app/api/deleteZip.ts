// app/api/deleteZip/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { filePath } = await request.json();

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid file path' }, { status: 400 });
    }

    // Resolve the absolute path
    const absolutePath = path.join(process.cwd(), filePath);

    await fs.unlink(absolutePath);

    return NextResponse.json({ success: true, message: 'File deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, message: 'Error deleting the file' }, { status: 500 });
  }
}
