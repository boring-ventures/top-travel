import { NextRequest, NextResponse } from "next/server";
import { uploadImageToStorage } from "@/lib/supabase/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Test upload to destinations bucket
    const url = await uploadImageToStorage(file, {
      bucket: "destinations",
      folder: "test",
      quality: 80,
      width: 1200,
      height: 800,
      fit: "cover",
    });

    return NextResponse.json({
      success: true,
      url,
      message: "Image uploaded and converted to WebP successfully",
    });
  } catch (error) {
    console.error("Test upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
