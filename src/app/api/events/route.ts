import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventCreateSchema } from "@/lib/validations/event";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeRichJson } from "@/lib/sanitize";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "events:list",
    });
    const { searchParams } = new URL(request.url);
    const session = await auth();
    const isSuperadmin = session?.user?.role === "SUPERADMIN";
    const status = searchParams.get("status") as "DRAFT" | "PUBLISHED" | null;
    const city = searchParams.get("city") || undefined;
    const country = searchParams.get("country") || undefined;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100, // Increased from 50 to 100
      Math.max(1, parseInt(searchParams.get("pageSize") || "50", 10)) // Changed default from 10 to 50
    );
    const skip = (page - 1) * pageSize;

    const where: any = {
      status: isSuperadmin ? (status ?? undefined) : "PUBLISHED",
      ...(from || to
        ? {
            AND: [
              from ? { endDate: { gte: new Date(from) } } : {},
              to ? { startDate: { lte: new Date(to) } } : {},
            ],
          }
        : {}),
      ...(city || country
        ? {
            destination: {
              ...(city
                ? { city: { contains: city, mode: "insensitive" } }
                : {}),
              ...(country
                ? { country: { contains: country, mode: "insensitive" } }
                : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: "asc" },
        skip,
        take: pageSize,
        include: {
          destination: true,
          eventTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    // Transform items to include tagIds for frontend compatibility
    const transformedItems = items.map((item) => ({
      ...item,
      tagIds: item.eventTags.map((et) => et.tag.id),
      tags: item.eventTags.map((et) => et.tag),
    }));

    return NextResponse.json({
      items: transformedItems,
      total,
      page,
      pageSize,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();

    // Debug: Log the received data
    console.log("API POST /events - Received data:", json);
    console.log(
      "API POST /events - heroImageUrl in received data:",
      json.heroImageUrl
    );

    const parsed = EventCreateSchema.parse(json);

    // Debug: Log the parsed data
    console.log("API POST /events - Parsed data:", parsed);
    console.log(
      "API POST /events - heroImageUrl in parsed data:",
      parsed.heroImageUrl
    );

    const { tagIds, ...eventData } = parsed;

    const created = await prisma.event.create({
      data: {
        ...eventData,
        detailsJson: sanitizeRichJson(eventData.detailsJson),
        gallery: sanitizeRichJson(eventData.gallery),
        eventTags:
          tagIds && tagIds.length > 0
            ? {
                create: tagIds.map((tagId) => ({
                  tagId,
                })),
              }
            : undefined,
      },
      include: {
        destination: true,
        eventTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Debug: Log the created event
    console.log("API POST /events - Created event:", created);
    console.log(
      "API POST /events - heroImageUrl in created event:",
      created.heroImageUrl
    );

    // Transform response to include tagIds for frontend compatibility
    const transformedEvent = {
      ...created,
      tagIds: created.eventTags.map((et) => et.tag.id),
      tags: created.eventTags.map((et) => et.tag),
    };

    return NextResponse.json(transformedEvent, { status: 201 });
  } catch (error: any) {
    console.error("API POST /events - Error:", error);
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create event" },
      { status }
    );
  }
}
