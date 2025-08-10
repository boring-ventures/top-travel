import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventUpdateSchema } from "@/lib/validations/event";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const item = await prisma.event.findUnique({
      where: { slug: params.slug },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = EventUpdateSchema.parse(json);
    const updated = await prisma.event.update({
      where: { slug: params.slug },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update event" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    await prisma.event.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete event" },
      { status }
    );
  }
}
