import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WhatsAppTemplateCreateSchema } from "@/lib/validations/whatsapp-template";
import { auth, ensureSuperadmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      keyPrefix: "wa-templates:list",
    });
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const usageType = searchParams.get("usageType");
    const skip = (page - 1) * pageSize;

    // Build where clause for filtering
    const whereClause = usageType ? { usageType } : {};

    const [items, total] = await Promise.all([
      prisma.whatsAppTemplate.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.whatsAppTemplate.count({ where: whereClause }),
    ]);

    // Ensure phoneNumbers array is properly formatted for all items
    const formattedItems = items.map((item) => ({
      ...item,
      phoneNumbers:
        item.phoneNumbers || (item.phoneNumber ? [item.phoneNumber] : []),
    }));

    return NextResponse.json({ items: formattedItems, total, page, pageSize });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const json = await request.json();
    const parsed = WhatsAppTemplateCreateSchema.parse(json);

    // Ensure phoneNumber is set (use first phone number from array)
    const data = {
      ...parsed,
      phoneNumber: parsed.phoneNumbers?.[0] || parsed.phoneNumber || "",
    };

    const created = await prisma.whatsAppTemplate.create({ data });

    // Return formatted response
    const formattedItem = {
      ...created,
      phoneNumbers:
        created.phoneNumbers ||
        (created.phoneNumber ? [created.phoneNumber] : []),
    };

    return NextResponse.json(formattedItem, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to create template" },
      { status }
    );
  }
}
