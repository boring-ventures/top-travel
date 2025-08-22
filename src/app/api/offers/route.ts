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
    const displayTag = searchParams.get("displayTag");
    
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

    // Display tag filter
    if (displayTag && displayTag !== "all") {
      where.displayTag = displayTag;
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
          where.AND = [
            { endAt: { not: null } },
            { endAt: { lt: now } },
          ];
          break;
        case "no-date":
          where.AND = [
            { startAt: null },
            { endAt: null },
          ];
          break;
      }
    }

    // Search filter
    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
        { displayTag: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.offer.count({ where }),
    ]);

    // Get unique display tags for filter dropdown
    const displayTags = await prisma.offer.findMany({
      where: {
        displayTag: { not: null },
      },
      select: {
        displayTag: true,
      },
      distinct: ["displayTag"],
    });

    return NextResponse.json({ 
      items, 
      total, 
      page, 
      pageSize,
      displayTags: displayTags.map(tag => tag.displayTag).filter(Boolean)
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
