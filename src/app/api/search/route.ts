import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 30,
      windowMs: 60_000,
      keyPrefix: "search:global",
    });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.toLowerCase();

    // Search across multiple entities
    const [packages, destinations, events, fixedDepartures] = await Promise.all(
      [
        // Search packages
        prisma.package.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { summary: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
          take: 5,
          include: {
            packageDestinations: {
              include: {
                destination: true,
              },
            },
            packageTags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),

        // Search destinations
        prisma.destination.findMany({
          where: {
            OR: [
              { country: { contains: searchTerm, mode: "insensitive" } },
              { city: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
          take: 5,
          include: {
            destinationTags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: [{ country: "asc" }, { city: "asc" }],
        }),

        // Search events
        prisma.event.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { artistOrEvent: { contains: searchTerm, mode: "insensitive" } },
              { venue: { contains: searchTerm, mode: "insensitive" } },
              {
                destination: {
                  OR: [
                    { city: { contains: searchTerm, mode: "insensitive" } },
                    { country: { contains: searchTerm, mode: "insensitive" } },
                  ],
                },
              },
            ],
          },
          take: 5,
          include: {
            destination: true,
          },
          orderBy: { startDate: "asc" },
        }),

        // Search fixed departures
        prisma.fixedDeparture.findMany({
          where: {
            status: "PUBLISHED",
            OR: [{ title: { contains: searchTerm, mode: "insensitive" } }],
          },
          take: 5,
          include: {
            destination: true,
          },
          orderBy: { startDate: "asc" },
        }),
      ]
    );

    // Transform results to a unified format
    const results = [
      ...packages.map((pkg) => ({
        type: "package" as const,
        id: pkg.id,
        title: pkg.title,
        subtitle: pkg.summary,
        url: `/packages/${pkg.slug}`,
        image: pkg.heroImageUrl,
        price: pkg.fromPrice ? Number(pkg.fromPrice) : undefined,
        currency: pkg.currency,
        destinations: pkg.packageDestinations.map((pd) => pd.destination),
        tags: pkg.packageTags.map((pt) => pt.tag),
      })),
      ...destinations.map((dest) => ({
        type: "destination" as const,
        id: dest.id,
        title: `${dest.city}, ${dest.country}`,
        subtitle: dest.description,
        url: `/destinations/${dest.slug}`,
        image: dest.heroImageUrl,
        tags: dest.destinationTags.map((dt) => dt.tag),
      })),
      ...events.map((event) => ({
        type: "event" as const,
        id: event.id,
        title: event.title,
        subtitle: `${event.artistOrEvent} - ${event.venue || event.destination?.city || "Ubicación por confirmar"}`,
        url: `/events/${event.slug}`,
        price: event.fromPrice ? Number(event.fromPrice) : undefined,
        currency: event.currency,
        startDate: event.startDate,
      })),
      ...fixedDepartures.map((fd) => ({
        type: "fixed-departure" as const,
        id: fd.id,
        title: fd.title,
        subtitle: `${fd.destination.city}, ${fd.destination.country}`,
        url: `/fixed-departures/${fd.slug}`,
        startDate: fd.startDate,
        endDate: fd.endDate,
        destination: fd.destination,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
