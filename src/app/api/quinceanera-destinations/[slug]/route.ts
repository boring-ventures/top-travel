import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QuinceaneraDestinationUpdateSchema } from "@/lib/validations/quinceanera-destination";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { sanitizeRichJson } from "@/lib/sanitize";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const item = await prisma.quinceaneraDestination.findUnique({
      where: { slug },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Quinceanera destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quinceanera destination" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    const json = await request.json();
    const parsed = QuinceaneraDestinationUpdateSchema.parse(json);

    const updated = await prisma.quinceaneraDestination.update({
      where: { slug },
      data: {
        ...parsed,
        gallery: parsed.gallery ? sanitizeRichJson(parsed.gallery) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Quinceanera destination update error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Quinceanera destination not found" },
        { status: 404 }
      );
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data provided", details: error.errors },
        { status: 400 }
      );
    }

    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update quinceanera destination" },
      { status }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;

    await prisma.quinceaneraDestination.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Quinceanera destination deletion error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Quinceanera destination not found" },
        { status: 404 }
      );
    }

    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete quinceanera destination" },
      { status }
    );
  }
}
