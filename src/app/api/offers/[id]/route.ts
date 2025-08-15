import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OfferUpdateSchema } from "@/lib/validations/offer";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.offer.findUnique({ where: { id } });
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
    console.log("PATCH request received for offers");
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { id } = await params;
    console.log("Updating offer with ID:", id);

    const json = await request.json();
    console.log("Request body:", json);

    const parsed = OfferUpdateSchema.parse(json);
    console.log("Parsed data:", parsed);

    const updated = await prisma.offer.update({
      where: { id },
      data: parsed,
    });
    console.log("Updated offer:", updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating offer:", error);
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
    const { id } = await params;
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete offer" },
      { status }
    );
  }
}
