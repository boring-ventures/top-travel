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
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
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

    const updated = await prisma.event.update({
      where: { slug },
      data: {
        ...parsed,
        detailsJson: parsed.detailsJson
          ? sanitizeRichJson(parsed.detailsJson)
          : undefined,
        gallery: parsed.gallery ? sanitizeRichJson(parsed.gallery) : undefined,
      },
    });

    // Debug: Log the updated event
    console.log("API PATCH /events/[slug] - Updated event:", updated);
    console.log(
      "API PATCH /events/[slug] - heroImageUrl in updated event:",
      updated.heroImageUrl
    );

    return NextResponse.json(updated);
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
