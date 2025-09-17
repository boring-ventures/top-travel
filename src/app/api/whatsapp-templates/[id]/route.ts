import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WhatsAppTemplateUpdateSchema } from "@/lib/validations/whatsapp-template";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.whatsAppTemplate.findUnique({
      where: { id },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Ensure phoneNumbers array is properly formatted
    const formattedItem = {
      ...item,
      phoneNumbers:
        item.phoneNumbers || (item.phoneNumber ? [item.phoneNumber] : []),
    };

    return NextResponse.json(formattedItem);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { id } = await params;
    const json = await request.json();
    const parsed = WhatsAppTemplateUpdateSchema.parse(json);

    // Ensure phoneNumbers and phoneNumber are properly handled
    const updateData = {
      ...parsed,
      // If phoneNumbers is provided, use it; otherwise keep existing
      ...(parsed.phoneNumbers && {
        phoneNumbers: parsed.phoneNumbers,
        phoneNumber: parsed.phoneNumbers[0] || parsed.phoneNumber || "",
      }),
    };

    const updated = await prisma.whatsAppTemplate.update({
      where: { id },
      data: updateData,
    });

    // Return formatted response
    const formattedItem = {
      ...updated,
      phoneNumbers:
        updated.phoneNumbers ||
        (updated.phoneNumber ? [updated.phoneNumber] : []),
    };

    return NextResponse.json(formattedItem);
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update template" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { id } = await params;
    await prisma.whatsAppTemplate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete template" },
      { status }
    );
  }
}
