import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import { logError } from '@/lib/logger';

const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
const maxSize = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !allowedTypes.includes(type.mime)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds limit (5MB)" }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN is not set. Skipping actual file upload to Vercel Blob.");
      return NextResponse.json({
        success: true,
        message: "File upload simulated (BLOB_READ_WRITE_TOKEN not set).",
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    }

    const blob = await put(file.name, buffer, {
      access: "public",
      contentType: type.mime,
    });

    const { data: newUpload, error } = await supabase
      .from('file_uploads')
      .insert([
        {
          id: uuidv4(),
          user_id: (session.user as any).id,
          file_name: file.name,
          file_type: type.mime,
          file_size: file.size,
          url: blob.url,
          pathname: blob.pathname,
        },
      ])
      .select()
      .single();

    if (error) {
      await logError(error);
      return NextResponse.json({ error: 'Error creating file upload record' }, { status: 500 });
    }

    return NextResponse.json(newUpload);
  } catch (error) {
    await logError(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
