import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PageCreateSchema } from "@/lib/validations/page";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { sanitizeRichJson } from "@/lib/sanitize";

export async function GET() {
  try {
    const items = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    });
    return ok(items);
  } catch {
    return error("Failed to fetch pages", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = PageCreateSchema.parse(json);
    const created = await prisma.page.create({
      data: { ...parsed, sectionsJson: sanitizeRichJson(parsed.sectionsJson) },
    });
    return ok(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return error(error?.message ?? "Failed to create page", status);
  }
}
