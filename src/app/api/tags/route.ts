import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TagCreateSchema } from "@/lib/validations/tag";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "tags:list",
    });
    const items = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = TagCreateSchema.parse(json);
    const created = await prisma.tag.create({ data: parsed });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create tag" },
      { status }
    );
  }
}
