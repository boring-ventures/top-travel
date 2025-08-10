import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DestinationCreateSchema } from "@/lib/validations/destination";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "destinations:list",
    });
    const { searchParams } = new URL(request.url);
    const session = await auth();
    const _isSuperadmin = session?.user?.role === "SUPERADMIN";
    const country = searchParams.get("country") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const isFeatured =
      searchParams.get("featured") === "true" ? true : undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const where: any = { country, city, isFeatured };
    const [items, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.destination.count({ where }),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const json = await request.json();
    const parsed = DestinationCreateSchema.parse(json);

    const created = await prisma.destination.create({
      data: {
        slug: parsed.slug,
        country: parsed.country,
        city: parsed.city,
        description: parsed.description,
        heroImageUrl: parsed.heroImageUrl,
        isFeatured: parsed.isFeatured ?? false,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create destination" },
      { status }
    );
  }
}
