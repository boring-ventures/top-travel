import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DestinationUpdateSchema } from "@/lib/validations/destination";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.destination.findUnique({
      where: { id },
      include: {
        destinationTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch destination" },
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

    console.log("PATCH request received for destination:", id);
    console.log("Request data:", json);

    const parsed = DestinationUpdateSchema.parse(json);
    console.log("Parsed data:", parsed);

    // Extract tagIds from the parsed data
    const { tagIds, ...destinationData } = parsed;
    console.log("Destination data:", destinationData);
    console.log("Tag IDs:", tagIds);

    // Use a transaction to update the destination and its tags
    const updated = await prisma.$transaction(async (tx) => {
      // Update the destination
      const destination = await tx.destination.update({
        where: { id },
        data: destinationData,
      });
      console.log("Updated destination:", destination);

      // If tagIds is provided, update the many-to-many relationship
      if (tagIds !== undefined) {
        console.log("Updating tag relationships...");
        // Delete existing tag relationships
        await tx.destinationTag.deleteMany({
          where: { destinationId: id },
        });
        console.log("Deleted existing tag relationships");

        // Create new tag relationships if tagIds is not empty
        if (tagIds.length > 0) {
          const tagRelationships = tagIds.map((tagId: string) => ({
            destinationId: id,
            tagId,
          }));
          console.log("Creating tag relationships:", tagRelationships);
          await tx.destinationTag.createMany({
            data: tagRelationships,
          });
          console.log("Created new tag relationships");
        }
      }

      return destination;
    });

    console.log("Transaction completed successfully");
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH error:", error);
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to update destination" },
      { status }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);
    const { id } = await params;
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete destination" },
      { status }
    );
  }
}
