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

    // Enhanced filter parameters
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const featuredParam = searchParams.get("featured");
    const dateFilter = searchParams.get("dateFilter");

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const now = new Date();
    const where: any = {};

    // Status filter
    if (status && status !== "all") {
      where.status = isSuperadmin ? status : "PUBLISHED";
    } else if (!isSuperadmin) {
      where.status = "PUBLISHED";
    }

    // Featured filter
    if (featuredParam && featuredParam !== "all") {
      where.isFeatured = featuredParam === "true";
    }

    // Date filter
    if (dateFilter && dateFilter !== "all") {
      switch (dateFilter) {
        case "active":
          where.OR = [
            { startAt: null, endAt: null },
            {
              AND: [
                { startAt: { lte: now } },
                { OR: [{ endAt: null }, { endAt: { gte: now } }] },
              ],
            },
          ];
          break;
        case "upcoming":
          where.startAt = { gt: now };
          break;
        case "expired":
          where.AND = [{ endAt: { not: null } }, { endAt: { lt: now } }];
          break;
        case "no-date":
          where.AND = [{ startAt: null }, { endAt: null }];
          break;
      }
    }

    // Search filter
    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          offerTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.offer.count({ where }),
    ]);

    // Transform items to include tagIds for frontend compatibility
    const transformedItems = items.map((item) => ({
      ...item,
      tagIds: item.offerTags.map((ot) => ot.tag.id),
      tags: item.offerTags.map((ot) => ot.tag),
    }));

    return NextResponse.json({
      items: transformedItems,
      total,
      page,
      pageSize,
    });
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

    const { tagIds, ...offerData } = parsed;

    const created = await prisma.offer.create({
      data: {
        ...offerData,
        title: offerData.title,
        subtitle: offerData.subtitle,
        bannerImageUrl: offerData.bannerImageUrl,
        isFeatured: offerData.isFeatured ?? false,
        startAt: offerData.startAt ? new Date(offerData.startAt) : undefined,
        endAt: offerData.endAt ? new Date(offerData.endAt) : undefined,
        status: offerData.status,
        packageId: offerData.packageId,
        externalUrl: offerData.externalUrl,
        offerTags:
          tagIds && tagIds.length > 0
            ? {
                create: tagIds.map((tagId) => ({
                  tagId,
                })),
              }
            : undefined,
      },
      include: {
        offerTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Transform response to include tagIds for frontend compatibility
    const transformedOffer = {
      ...created,
      tagIds: created.offerTags.map((ot) => ot.tag.id),
      tags: created.offerTags.map((ot) => ot.tag),
    };

    return NextResponse.json(transformedOffer, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create offer" },
      { status }
    );
  }
}
