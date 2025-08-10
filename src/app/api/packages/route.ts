import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PackageCreateSchema } from "@/lib/validations/package";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeRichJson } from "@/lib/sanitize";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "packages:list",
    });
    const { searchParams } = new URL(request.url);
    const session = await auth();
    const isSuperadmin = session?.user?.role === "SUPERADMIN";
    const status = searchParams.get("status") as "DRAFT" | "PUBLISHED" | null;
    const isCustomParam = searchParams.get("isCustom");
    const isCustom =
      isCustomParam === null ? undefined : isCustomParam === "true";
    const q = searchParams.get("q") || undefined;
    const tagId = searchParams.get("tagId") || undefined;
    const destinationId = searchParams.get("destinationId") || undefined;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const where: any = {
      status: isSuperadmin ? (status ?? undefined) : "PUBLISHED",
      isCustom,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(destinationId
        ? { packageDestinations: { some: { destinationId } } }
        : {}),
      ...(tagId ? { packageTags: { some: { tagId } } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.package.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.package.count({ where }),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = PackageCreateSchema.parse(json);

    const created = await prisma.package.create({
      data: {
        slug: parsed.slug,
        title: parsed.title,
        summary: parsed.summary,
        heroImageUrl: parsed.heroImageUrl,
        gallery: sanitizeRichJson(parsed.gallery),
        itineraryJson: sanitizeRichJson(parsed.itineraryJson),
        inclusions: parsed.inclusions ?? [],
        exclusions: parsed.exclusions ?? [],
        durationDays: parsed.durationDays,
        fromPrice: parsed.fromPrice,
        currency: parsed.currency,
        isCustom: parsed.isCustom ?? false,
        status: parsed.status ?? "DRAFT",
        packageDestinations: parsed.destinationIds
          ? {
              createMany: {
                data: parsed.destinationIds.map((id) => ({
                  destinationId: id,
                })),
              },
            }
          : undefined,
        packageTags: parsed.tagIds
          ? { createMany: { data: parsed.tagIds.map((id) => ({ tagId: id })) } }
          : undefined,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create package" },
      { status }
    );
  }
}
