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
  // For now, we'll implement this later if needed
  // This would require a server-side API endpoint as well
  console.warn("Delete image functionality not yet implemented");
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
