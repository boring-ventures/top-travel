import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { auth, ensureSuperadmin } from "@/lib/auth";

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
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    try {
      ensureSuperadmin(session?.user);
    } catch (authError) {
      return NextResponse.json(
        { error: "Insufficient permissions - SUPERADMIN role required" },
        { status: 403 }
      );
    }

    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase URL" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
      return NextResponse.json(
        {
          error:
            "Server configuration error: Missing Supabase service role key",
        },
        { status: 500 }
      );
    }

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
    let sharpInstance;
    try {
      sharpInstance = sharp(buffer);
    } catch (sharpError) {
      console.error("Sharp initialization error:", sharpError);
      return NextResponse.json(
        { error: "Image processing failed" },
        { status: 500 }
      );
    }

    // Resize if dimensions are provided
    if (width || height) {
      try {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: fit as any,
          kernel: "lanczos3", // Better quality resizing algorithm
          withoutEnlargement: true, // Don't upscale small images
        });
      } catch (resizeError) {
        console.error("Sharp resize error:", resizeError);
        return NextResponse.json(
          { error: "Image resize failed" },
          { status: 500 }
        );
      }
    }

    // Convert to WebP with improved settings
    let webpBuffer;
    try {
      webpBuffer = await sharpInstance
        .webp({
          quality,
          effort: 6, // Higher compression effort for better quality
          nearLossless: false, // Keep lossy for better compression
          smartSubsample: true, // Better color sampling
        })
        .toBuffer();
    } catch (webpError) {
      console.error("Sharp WebP conversion error:", webpError);
      return NextResponse.json(
        { error: "Image conversion failed" },
        { status: 500 }
      );
    }

    // Generate unique filename
    const fileName = generateFileName(file.name, folder);
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    console.log(`Uploading to bucket: ${bucket}, path: ${filePath}`);
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, webpBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
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
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    try {
      ensureSuperadmin(session?.user);
    } catch (authError) {
      return NextResponse.json(
        { error: "Insufficient permissions - SUPERADMIN role required" },
        { status: 403 }
      );
    }

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
