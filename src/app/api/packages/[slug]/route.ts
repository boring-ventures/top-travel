import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PackageUpdateSchema } from "@/lib/validations/package";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const item = await prisma.package.findUnique({
      where: { slug: params.slug },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = PackageUpdateSchema.parse(json);
    const updated = await prisma.package.update({
      where: { slug: params.slug },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update package" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    await prisma.package.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete package" },
      { status }
    );
  }
}
