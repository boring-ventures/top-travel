import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

// Only create Supabase client on server side
const supabase =
  typeof window === "undefined"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : null;

export interface StorageUploadOptions {
  bucket: string;
  folder?: string;
  quality?: number;
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

export async function uploadImageToStorage(
  file: File,
  options: StorageUploadOptions
): Promise<string> {
  const {
    bucket,
    folder,
    quality = 90,
    width,
    height,
    fit = "cover",
  } = options;

  try {
    // Create FormData for the upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    if (folder) formData.append("folder", folder);
    formData.append("quality", quality.toString());
    if (width) formData.append("width", width.toString());
    if (height) formData.append("height", height.toString());
    formData.append("fit", fit);

    // Upload to our server-side API
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}

export async function deleteImageFromStorage(
  bucket: string,
  path: string
): Promise<void> {
  try {
    const response = await fetch(
      `/api/upload-image?bucket=${bucket}&path=${encodeURIComponent(path)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Delete failed");
    }

    console.log(`Image deleted successfully: ${bucket}/${path}`);
  } catch (error) {
    console.error("Image delete error:", error);
    throw error;
  }
}

export async function uploadAvatar(
  file: File,
  userId: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "avatars",
    folder: "users",
    quality,
    width: 400,
    height: 400,
    fit: "cover",
  });
}

export async function uploadDestinationImage(
  file: File,
  destinationSlug: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "destinations",
    folder: destinationSlug,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function uploadPackageImage(
  file: File,
  packageSlug: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "packages",
    folder: packageSlug,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function uploadOfferImage(
  file: File,
  offerId: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "offers",
    folder: offerId,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function uploadDepartmentImage(
  file: File,
  departmentType: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "departments",
    folder: departmentType,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function uploadEventImage(
  file: File,
  eventSlug: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "events",
    folder: eventSlug,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function uploadFixedDepartureImage(
  file: File,
  departureSlug: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "fixed-departures",
    folder: departureSlug,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function uploadTestimonialImage(
  file: File,
  testimonialId: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "testimonials",
    folder: testimonialId,
    quality,
    width: 400,
    height: 400,
    fit: "cover",
  });
}

export async function uploadPageImage(
  file: File,
  pageSlug: string,
  quality: number = 80
): Promise<string> {
  return uploadImageToStorage(file, {
    bucket: "pages",
    folder: pageSlug,
    quality,
    width: file.size,
    height: file.size,
    fit: "cover",
  });
}

export async function cleanupOrphanedImages(): Promise<{
  deleted: string[];
  errors: string[];
}> {
  const deleted: string[] = [];
  const errors: string[] = [];

  try {
    // Get all images from storage buckets
    const buckets = [
      "packages",
      "destinations",
      "events",
      "offers",
      "fixed-departures",
      "departments",
    ];

    for (const bucket of buckets) {
      console.log(`Checking bucket: ${bucket}`);

      // List all files in the bucket
      if (!supabase) {
        throw new Error("Supabase client not available");
      }
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list("", { limit: 1000 });

      if (listError) {
        console.error(`Error listing files in ${bucket}:`, listError);
        errors.push(`Failed to list files in ${bucket}: ${listError.message}`);
        continue;
      }

      if (!files || files.length === 0) {
        console.log(`No files found in ${bucket}`);
        continue;
      }

      // Get all image URLs from the database for this bucket
      let dbImageUrls: string[] = [];

      switch (bucket) {
        case "packages":
          const packages = await prisma.package.findMany({
            select: { heroImageUrl: true },
          });
          dbImageUrls = packages
            .map((p: any) => p.heroImageUrl)
            .filter((url): url is string => url !== null && url !== undefined);
          break;
        case "destinations":
          const destinations = await prisma.destination.findMany({
            select: { heroImageUrl: true },
          });
          dbImageUrls = destinations
            .map((d: any) => d.heroImageUrl)
            .filter((url): url is string => url !== null && url !== undefined);
          break;
        case "events":
          const events = await prisma.event.findMany({
            select: { heroImageUrl: true },
          });
          dbImageUrls = events
            .map((e: any) => e.heroImageUrl)
            .filter((url): url is string => url !== null && url !== undefined);
          break;
        case "offers":
          const offers = await prisma.offer.findMany({
            select: { bannerImageUrl: true },
          });
          dbImageUrls = offers
            .map((o: any) => o.bannerImageUrl)
            .filter((url): url is string => url !== null && url !== undefined);
          break;
        case "fixed-departures":
          const fixedDepartures = await prisma.fixedDeparture.findMany({
            select: { heroImageUrl: true },
          });
          dbImageUrls = fixedDepartures
            .map((fd: any) => fd.heroImageUrl)
            .filter((url): url is string => url !== null && url !== undefined);
          break;
        case "departments":
          const departments = await prisma.department.findMany({
            select: { heroImageUrl: true },
          });
          dbImageUrls = departments
            .map((d: any) => d.heroImageUrl)
            .filter((url): url is string => url !== null && url !== undefined);
          break;
      }

      // Extract file paths from database URLs
      const dbFilePaths = dbImageUrls
        .map((url) => {
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split("/");
            return pathParts[pathParts.length - 1]; // Get just the filename
          } catch {
            return null;
          }
        })
        .filter((path): path is string => path !== null);

      // Find orphaned files
      const orphanedFiles = files.filter(
        (file) =>
          !dbFilePaths.includes(file.name) && file.name.endsWith(".webp")
      );

      console.log(`Found ${orphanedFiles.length} orphaned files in ${bucket}`);

      // Delete orphaned files
      for (const file of orphanedFiles) {
        try {
          await deleteImageFromStorage(bucket, file.name);
          deleted.push(`${bucket}/${file.name}`);
          console.log(`Deleted orphaned file: ${bucket}/${file.name}`);
        } catch (error) {
          const errorMsg = `Failed to delete ${bucket}/${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

    console.log(
      `Cleanup completed. Deleted: ${deleted.length}, Errors: ${errors.length}`
    );
    return { deleted, errors };
  } catch (error) {
    console.error("Error during cleanup:", error);
    errors.push(
      `Cleanup failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return { deleted, errors };
  }
}
