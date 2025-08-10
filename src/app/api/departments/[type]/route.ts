import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DepartmentUpdateSchema } from "@/lib/validations/department";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: { type: "WEDDINGS" | "QUINCEANERA" } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const item = await prisma.department.findUnique({
      where: { type: params.type },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = DepartmentUpdateSchema.parse(json);
    const updated = await prisma.department.update({
      where: { type: params.type },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update department" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    await prisma.department.delete({ where: { type: params.type } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete department" },
      { status }
    );
  }
}
