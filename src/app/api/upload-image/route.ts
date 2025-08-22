import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UploadOptions {
  bucket: string;
  folder?: string;
  quality?: number;
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).slice(2, 8);
  const extension = "webp";

  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName}-${timestamp}-${randomId}.${extension}`;

  return prefix ? `${prefix}/${fileName}` : fileName;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const folder = formData.get("folder") as string;
    const quality = parseInt(formData.get("quality") as string) || 90; // Increased from 80 to 90
    const width = parseInt(formData.get("width") as string) || undefined;
    const height = parseInt(formData.get("height") as string) || undefined;
    const fit = (formData.get("fit") as string) || "cover";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!bucket) {
      return NextResponse.json(
        { error: "No bucket specified" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with Sharp
    let sharpInstance = sharp(buffer);

    // Resize if dimensions are provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: fit as any,
        kernel: "lanczos3", // Better quality resizing algorithm
        withoutEnlargement: true, // Don't upscale small images
      });
    }

    // Convert to WebP with improved settings
    const webpBuffer = await sharpInstance
      .webp({
        quality,
        effort: 6, // Higher compression effort for better quality
        nearLossless: false, // Keep lossy for better compression
        smartSubsample: true, // Better color sampling
      })
      .toBuffer();

    // Generate unique filename
    const fileName = generateFileName(file.name, folder);
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, webpBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
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
