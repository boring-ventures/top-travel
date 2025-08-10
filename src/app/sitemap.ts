import prisma from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const [packages, events, destinations, fixed] = await Promise.all([
    prisma.package.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.destination.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.fixedDeparture.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPaths: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/vision",
    "/mission",
    "/testimonials",
    "/contact",
    "/packages",
    "/events",
    "/destinations",
    "/fixed-departures",
  ].map((p) => ({ url: `${baseUrl}${p}`, lastModified: new Date() }));

  const dynamicPaths: MetadataRoute.Sitemap = [
    ...packages.map((i) => ({
      url: `${baseUrl}/packages/${i.slug}`,
      lastModified: i.updatedAt,
    })),
    ...events.map((i) => ({
      url: `${baseUrl}/events/${i.slug}`,
      lastModified: i.updatedAt,
    })),
    ...destinations.map((i) => ({
      url: `${baseUrl}/destinations/${i.slug}`,
      lastModified: i.updatedAt,
    })),
    ...fixed.map((i) => ({
      url: `${baseUrl}/fixed-departures/${i.slug}`,
      lastModified: i.updatedAt,
    })),
  ];

  return [...staticPaths, ...dynamicPaths];
}
