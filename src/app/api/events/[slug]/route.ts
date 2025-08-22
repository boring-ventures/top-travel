import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventUpdateSchema } from "@/lib/validations/event";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { sanitizeRichJson } from "@/lib/sanitize";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const item = await prisma.event.findUnique({
      where: { slug },
      include: {
        eventTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    // Transform response to include tagIds for frontend compatibility
    const transformedItem = {
      ...item,
      tagIds: item.eventTags.map((et) => et.tag.id),
      tags: item.eventTags.map((et) => et.tag),
    };
    
    return NextResponse.json(transformedItem);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    const json = await request.json();

    // Debug: Log the received data
    console.log("API PATCH /events/[slug] - Received data:", json);
    console.log(
      "API PATCH /events/[slug] - heroImageUrl in received data:",
      json.heroImageUrl
    );

    const parsed = EventUpdateSchema.parse(json);

    // Debug: Log the parsed data
    console.log("API PATCH /events/[slug] - Parsed data:", parsed);
    console.log(
      "API PATCH /events/[slug] - heroImageUrl in parsed data:",
      parsed.heroImageUrl
    );

    const { tagIds, ...eventData } = parsed;

    // Use a transaction to handle tag relationships
    const updated = await prisma.$transaction(async (tx) => {
      // Update the event
      const event = await tx.event.update({
        where: { slug },
        data: {
          ...eventData,
          detailsJson: eventData.detailsJson
            ? sanitizeRichJson(eventData.detailsJson)
            : undefined,
          gallery: eventData.gallery ? sanitizeRichJson(eventData.gallery) : undefined,
        },
      });

      // Handle tag relationships
      if (tagIds !== undefined) {
        // Delete existing tag relationships
        await tx.eventTag.deleteMany({
          where: { eventId: event.id },
        });

        // Create new tag relationships if tagIds are provided
        if (tagIds && tagIds.length > 0) {
          await tx.eventTag.createMany({
            data: tagIds.map((tagId) => ({
              eventId: event.id,
              tagId,
            })),
          });
        }
      }

      // Return the updated event with tags
      return tx.event.findUnique({
        where: { slug },
        include: {
          eventTags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });

    // Debug: Log the updated event
    console.log("API PATCH /events/[slug] - Updated event:", updated);
    console.log(
      "API PATCH /events/[slug] - heroImageUrl in updated event:",
      updated?.heroImageUrl
    );

    // Transform response to include tagIds for frontend compatibility
    const transformedEvent = {
      ...updated,
      tagIds: updated?.eventTags.map((et) => et.tag.id) || [],
      tags: updated?.eventTags.map((et) => et.tag) || [],
    };

    return NextResponse.json(transformedEvent);
  } catch (error: any) {
    console.error("API PATCH /events/[slug] - Error:", error);
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update event" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    await prisma.event.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete event" },
      { status }
    );
  }
}
