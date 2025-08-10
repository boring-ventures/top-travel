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
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const where: any = {
      status: isSuperadmin ? (status ?? undefined) : "PUBLISHED",
      locationCity: city,
      locationCountry: country,
      ...(from || to
        ? {
            AND: [
              from ? { endDate: { gte: new Date(from) } } : {},
              to ? { startDate: { lte: new Date(to) } } : {},
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.event.count({ where }),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
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
    const parsed = EventCreateSchema.parse(json);
    const created = await prisma.event.create({
      data: {
        ...parsed,
        detailsJson: sanitizeRichJson(parsed.detailsJson),
        gallery: sanitizeRichJson(parsed.gallery),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create event" },
      { status }
    );
  }
}
