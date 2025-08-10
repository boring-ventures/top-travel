import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
