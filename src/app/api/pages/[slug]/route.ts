import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PageUpdateSchema } from "@/lib/validations/page";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { sanitizeRichJson } from "@/lib/sanitize";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const item = await prisma.page.findUnique({ where: { slug } });
    if (!item) return error("Not found", 404);
    return ok(item);
  } catch {
    return error("Failed to fetch page", 500);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    const json = await request.json();
    const parsed = PageUpdateSchema.parse(json);
    const updated = await prisma.page.update({
      where: { slug },
      data: { ...parsed, sectionsJson: sanitizeRichJson(parsed.sectionsJson) },
    });
    return ok(updated);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return error(error?.message ?? "Failed to update page", status);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    await prisma.page.delete({ where: { slug } });
    return ok(true);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return error(error?.message ?? "Failed to delete page", status);
  }
}
