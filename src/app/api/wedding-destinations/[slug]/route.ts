import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WeddingDestinationUpdateSchema } from "@/lib/validations/wedding-destination";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { sanitizeRichJson } from "@/lib/sanitize";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const item = await prisma.weddingDestination.findUnique({
      where: { slug },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Wedding destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch wedding destination" },
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
    const parsed = WeddingDestinationUpdateSchema.parse(json);

    const updated = await prisma.weddingDestination.update({
      where: { slug },
      data: {
        ...parsed,
        gallery: parsed.gallery ? sanitizeRichJson(parsed.gallery) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Wedding destination update error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Wedding destination not found" },
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
      { error: error?.message ?? "Failed to update wedding destination" },
      { status }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;

    await prisma.weddingDestination.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Wedding destination deletion error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Wedding destination not found" },
        { status: 404 }
      );
    }

    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete wedding destination" },
      { status }
    );
  }
}
