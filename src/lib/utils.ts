import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Selects a random phone number from an array of phone numbers
 * @param phoneNumbers - Array of phone numbers
 * @returns A randomly selected phone number
 */
export function getRandomPhoneNumber(phoneNumbers: string[]): string {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    return "";
  }
  return phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
}

export function buildWhatsAppUrl(
  phone: string,
  template: string,
  vars: Record<string, string | undefined>,
  options?: {
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
      content?: string;
    };
    pageUrl?: string;
  }
) {
  const messageText = template.replace(
    /\{(\w+)\}/g,
    (_, key) => vars[key] ?? ""
  );
  const url = new URL(`https://wa.me/${phone}`);

  let finalText = messageText;
  const { utm, pageUrl } = options || {};
  const utmParams = new URLSearchParams();
  if (utm?.source) utmParams.set("utm_source", utm.source);
  if (utm?.medium) utmParams.set("utm_medium", utm.medium);
  if (utm?.campaign) utmParams.set("utm_campaign", utm.campaign);
  if (utm?.content) utmParams.set("utm_content", utm.content);

  if (pageUrl && Array.from(utmParams.keys()).length > 0) {
    const ref = `${pageUrl}${pageUrl.includes("?") ? "&" : "?"}${utmParams.toString()}`;
    finalText = `${messageText}\n\nRef: ${ref}`;
  }

  url.searchParams.set("text", finalText);
  return url.toString();
}

/**
 * Validates if a string is a valid image URL
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;

  // Filter out common invalid values
  if (
    url === "1" ||
    url === "0" ||
    url === "" ||
    url === "null" ||
    url === "undefined"
  ) {
    return false;
  }

  // Check if it's a valid URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Filters an array of objects to only include those with valid image URLs
 * @param items - Array of objects with image URL properties
 * @param imageUrlKey - The key containing the image URL
 * @returns Filtered array
 */
export function filterValidImageUrls<T extends Record<string, any>>(
  items: T[],
  imageUrlKey: keyof T
): T[] {
  return items.filter((item) => {
    const imageUrl = item[imageUrlKey];
    return isValidImageUrl(imageUrl);
  });
}
