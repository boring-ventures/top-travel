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
  } catch (error: any) {
    console.error("GET /api/departments - Error:", error);
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

    // Check if department with this type already exists
    const existing = await prisma.department.findUnique({
      where: { type: parsed.type },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Department with type '${parsed.type}' already exists` },
        { status: 409 }
      );
    }

    const created = await prisma.department.create({
      data: {
        ...parsed,
        themeJson: sanitizeRichJson(parsed.themeJson as any),
        heroContentJson: sanitizeRichJson(parsed.heroContentJson as any),
        packagesJson: sanitizeRichJson(parsed.packagesJson as any),
        servicesJson: sanitizeRichJson(parsed.servicesJson as any),
        contactInfoJson: sanitizeRichJson(parsed.contactInfoJson as any),
        additionalContentJson: sanitizeRichJson(
          parsed.additionalContentJson as any
        ),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Department creation error:", error);

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A department with this type already exists" },
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
      { error: error?.message ?? "Failed to create department" },
      { status }
    );
  }
}
