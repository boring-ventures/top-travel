import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PackageUpdateSchema } from "@/lib/validations/package";
import { auth, ensureSuperadmin } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    console.log("Fetching package with slug:", slug);

    const item = await prisma.package.findUnique({
      where: { slug },
      include: {
        packageDestinations: {
          include: {
            destination: true,
          },
        },
        packageTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!item) {
      console.log("Package not found:", slug);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("Package found:", item);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    console.log("PATCH request received for packages");
    const session = await auth();
    ensureSuperadmin(session?.user);

    const { slug } = await params;
    console.log("Updating package with slug:", slug);

    const json = await request.json();
    console.log("Request body:", json);

    const parsed = PackageUpdateSchema.parse(json);
    console.log("Parsed data:", parsed);

    const updated = await prisma.package.update({
      where: { slug },
      data: parsed,
    });
    console.log("Updated package:", updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating package:", error);
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
    const { slug } = await params;
    await prisma.package.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status ?? 400;
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete package" },
      { status }
    );
  }
}
