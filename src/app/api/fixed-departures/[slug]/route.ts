import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FixedDepartureUpdateSchema } from "@/lib/validations/fixed-departure";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const item = await prisma.fixedDeparture.findUnique({
      where: { slug },
      include: {
        destination: true,
      },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fixed departure" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    const json = await request.json();
    const parsed = FixedDepartureUpdateSchema.parse(json);
    const updated = await prisma.fixedDeparture.update({
      where: { slug },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update fixed departure" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { slug } = await params;
    await prisma.fixedDeparture.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete fixed departure" },
      { status }
    );
  }
}
