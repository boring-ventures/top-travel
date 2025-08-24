import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BlogPostUpdateSchema } from "@/lib/validations/blog-post";
import { auth, ensureSuperadmin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const item = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
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
    const parsed = BlogPostUpdateSchema.parse(json);

    const updated = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...parsed,
        publishedAt: parsed.publishedAt
          ? new Date(parsed.publishedAt)
          : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Blog post update error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Blog post not found" },
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
      { error: error?.message ?? "Failed to update blog post" },
      { status }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;

    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Blog post deletion error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete blog post" },
      { status }
    );
  }
}
