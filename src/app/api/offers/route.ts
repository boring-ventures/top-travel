import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OfferCreateSchema } from "@/lib/validations/offer";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "offers:list",
    });
    const { searchParams } = new URL(request.url);
    const session = await auth();
    const isSuperadmin = session?.user?.role === "SUPERADMIN";
    const status = searchParams.get("status") || undefined;
    const featuredParam = searchParams.get("featured");
    const isFeatured =
      featuredParam == null ? undefined : featuredParam === "true";
    const activeParam = searchParams.get("active");
    const isActiveOnly = activeParam === "true";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const now = new Date();
    const where: any = {
      status: isSuperadmin ? status : "PUBLISHED",
      isFeatured,
      ...(isActiveOnly
        ? {
            OR: [
              { startAt: null, endAt: null },
              {
                AND: [
                  { startAt: { lte: now } },
                  { OR: [{ endAt: null }, { endAt: { gte: now } }] },
                ],
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.offer.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const json = await request.json();
    const parsed = OfferCreateSchema.parse(json);

    const created = await prisma.offer.create({
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle,
        bannerImageUrl: parsed.bannerImageUrl,
        isFeatured: parsed.isFeatured ?? false,
        displayTag: parsed.displayTag,
        startAt: parsed.startAt ? new Date(parsed.startAt) : undefined,
        endAt: parsed.endAt ? new Date(parsed.endAt) : undefined,
        status: parsed.status,
        packageId: parsed.packageId,
        externalUrl: parsed.externalUrl,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create offer" },
      { status }
    );
  }
}
