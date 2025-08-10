import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DepartmentCreateSchema } from "@/lib/validations/department";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { sanitizeRichJson } from "@/lib/sanitize";

export async function GET() {
  try {
    const items = await prisma.department.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = DepartmentCreateSchema.parse(json);
    const created = await prisma.department.create({
      data: {
        ...parsed,
        themeJson: sanitizeRichJson(parsed.themeJson as any),
        featuredItemRefs: sanitizeRichJson((parsed as any).featuredItemRefs),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create department" },
      { status }
    );
  }
}
