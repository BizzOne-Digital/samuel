import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import StoredUpload from '@/models/StoredUpload';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  try {
    const { folder, filename } = await params;

    // Sanitize path - reject .. and / in filename
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    await connectDB();
    const upload = await StoredUpload.findOne({ folder, filename });

    if (!upload) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Return binary response with proper headers using Response
    // Convert Mongoose Buffer to Node Buffer for Response compatibility
    const buffer = Buffer.from(upload.data);
    
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': upload.mimeType,
        'Content-Length': upload.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching upload:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  try {
    const { folder, filename } = await params;

    // Sanitize path
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    await connectDB();
    const result = await StoredUpload.findOneAndDelete({ folder, filename });

    if (!result) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting upload:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
