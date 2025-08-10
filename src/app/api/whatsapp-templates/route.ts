import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WhatsAppTemplateCreateSchema } from "@/lib/validations/whatsapp-template";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "wa-templates:list",
    });
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.whatsAppTemplate.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.whatsAppTemplate.count(),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = WhatsAppTemplateCreateSchema.parse(json);
    const created = await prisma.whatsAppTemplate.create({ data: parsed });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create template" },
      { status }
    );
  }
}
