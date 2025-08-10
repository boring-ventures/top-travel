import type { Metadata } from "next";

const APP_NAME = "GABYTOPTRAVEL";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function buildBaseMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    metadataBase: new URL(APP_URL),
    openGraph: {
      siteName: APP_NAME,
      type: "website",
      url: APP_URL,
    },
    twitter: {
      card: "summary_large_image",
      site: APP_NAME,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  } satisfies Metadata;
}

export function pageMeta({
  title,
  description,
  urlPath,
  image,
}: {
  title: string;
  description?: string;
  urlPath?: string;
  image?: string | null | undefined;
}): Metadata {
  const absoluteUrl = urlPath ? new URL(urlPath, APP_URL).toString() : APP_URL;
  const images = image ? [{ url: image }] : undefined;
  return buildBaseMetadata({
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  });
}
