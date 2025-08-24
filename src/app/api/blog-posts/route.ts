import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BlogPostCreateSchema } from "@/lib/validations/blog-post";
import { auth, ensureSuperadmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where = type ? { type: type as "WEDDINGS" | "QUINCEANERA" } : {};

    const items = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = BlogPostCreateSchema.parse(json);

    // Check if blog post with this slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: parsed.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Blog post with slug '${parsed.slug}' already exists` },
        { status: 409 }
      );
    }

    const created = await prisma.blogPost.create({
      data: {
        ...parsed,
        publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Blog post creation error:", error);

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
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
      { error: error?.message ?? "Failed to create blog post" },
      { status }
    );
  }
}
