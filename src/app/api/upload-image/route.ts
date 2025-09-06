import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Valid buckets
const VALID_BUCKETS = [
  "offers",
  "packages", 
  "destinations",
  "departments",
  "events",
  "fixed-departures",
  "testimonials",
  "pages"
];

function generateFileName(originalName: string, folder?: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).slice(2, 8);
  const baseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '-');
  const fileName = `${baseName}-${timestamp}-${randomId}.webp`;
  return folder ? `${folder}/${fileName}` : fileName;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const folder = formData.get("folder") as string;
    const quality = parseInt(formData.get("quality") as string) || 85;
    const width = parseInt(formData.get("width") as string) || undefined;
    const height = parseInt(formData.get("height") as string) || undefined;

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!bucket) {
      return NextResponse.json({ error: "No bucket specified" }, { status: 400 });
    }

    if (!VALID_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Must be one of: ${VALID_BUCKETS.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with Sharp
    let sharpInstance = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "cover",
        withoutEnlargement: true,
      });
    }

    // Convert to WebP
    const webpBuffer = await sharpInstance
      .webp({
        quality,
        effort: 4,
      })
      .toBuffer();

    // Generate file path
    const fileName = generateFileName(file.name, folder);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, webpBuffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: fileName,
      bucket,
    });

  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket");
    const path = searchParams.get("path");

    if (!bucket || !path) {
      return NextResponse.json(
        { error: "Bucket and path are required" },
        { status: 400 }
      );
    }

    if (!VALID_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Must be one of: ${VALID_BUCKETS.join(", ")}` },
        { status: 400 }
      );
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });

  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 }
    );
  }
}