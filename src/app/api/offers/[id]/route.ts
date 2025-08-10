import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OfferUpdateSchema } from "@/lib/validations/offer";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const item = await prisma.offer.findUnique({ where: { id: params.id } });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch offer" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    const json = await request.json();
    const parsed = OfferUpdateSchema.parse(json);

    const updated = await prisma.offer.update({
      where: { id: params.id },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update offer" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    await prisma.offer.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete offer" },
      { status }
    );
  }
}
