import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QuinceaneraDestinationCreateSchema } from "@/lib/validations/quinceanera-destination";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { sanitizeRichJson } from "@/lib/sanitize";

export async function GET() {
  try {
    const items = await prisma.quinceaneraDestination.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quinceanera destinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = QuinceaneraDestinationCreateSchema.parse(json);

    // Check if destination with this slug already exists
    const existing = await prisma.quinceaneraDestination.findUnique({
      where: { slug: parsed.slug },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `Quinceanera destination with slug '${parsed.slug}' already exists`,
        },
        { status: 409 }
      );
    }

    const created = await prisma.quinceaneraDestination.create({
      data: {
        ...parsed,
        gallery: sanitizeRichJson(parsed.gallery),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Quinceanera destination creation error:", error);

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A quinceanera destination with this slug already exists" },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data provided", details: error.errors },
        { status: 400 }
      );
    }

    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create quinceanera destination" },
      { status }
    );
  }
}
