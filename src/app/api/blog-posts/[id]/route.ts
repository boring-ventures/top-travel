import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { blogPostUpdateSchema } from "@/lib/validations/blog-post";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { id } = await params;
    const json = await request.json();
    const updateData = blogPostUpdateSchema.parse(json);

    // Handle publishedAt logic
    const dataToUpdate = {
      ...updateData,
      ...(updateData.status === "PUBLISHED" && !updateData.publishedAt
        ? { publishedAt: new Date() }
        : updateData.status === "DRAFT"
          ? { publishedAt: null }
          : {}),
    };

    const updated = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update blog post" },
      { status }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete blog post" },
      { status }
    );
  }
}
