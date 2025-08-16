import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { isValidImageUrl } from "@/lib/utils";

interface PackagesPageProps {
  searchParams?: Promise<{
    q?: string;
    tagId?: string;
    destinationId?: string;
    isCustom?: string;
    page?: string;
  }>;
}

export default async function PackagesPage({
  searchParams,
}: PackagesPageProps) {
  const params = await searchParams;
  const q = params?.q?.trim() || undefined;
  const tagId = params?.tagId || undefined;
  const destinationId = params?.destinationId || undefined;
  const isCustomParam = params?.isCustom;
  const isCustom = isCustomParam == null ? undefined : isCustomParam === "true";

  const where: any = {
    status: "PUBLISHED",
    isCustom,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(destinationId
      ? { packageDestinations: { some: { destinationId } } }
      : {}),
    ...(tagId ? { packageTags: { some: { tagId } } } : {}),
  };

  const [packages, tags, destinations] = await Promise.all([
    prisma.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.destination.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }],
    }),
  ]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Paquetes
      </h1>
      <form className="grid grid-cols-1 md:grid-cols-4 gap-3" method="get">
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by title or summary"
        />
        <select
          className="w-full rounded border px-3 py-2 text-sm"
          name="tagId"
          defaultValue={tagId ?? ""}
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded border px-3 py-2 text-sm"
          name="destinationId"
          defaultValue={destinationId ?? ""}
        >
          <option value="">All destinations</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.city}, {d.country}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded border px-3 py-2 text-sm"
          name="isCustom"
          defaultValue={isCustomParam ?? ""}
        >
          <option value="">All types</option>
          <option value="false">Pre-built</option>
          <option value="true">Custom</option>
        </select>
        <div className="md:col-span-4">
          <button className="rounded bg-black text-white px-4 py-2 text-sm">
            Filter
          </button>
        </div>
      </form>

      {packages.length === 0 ? (
        <div className="text-sm text-muted-foreground">No packages found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {packages.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <Link href={`/packages/${p.slug}`} className="block">
                <div className="relative w-full h-40">
                  {p.heroImageUrl && isValidImageUrl(p.heroImageUrl) ? (
                    <Image
                      src={p.heroImageUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium">{p.title}</div>
                  {p.summary && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {p.summary}
                    </div>
                  )}
                  <div className="text-xs mt-2">
                    {p.isCustom ? "Custom" : "Pre-built"}
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <WhatsAppCTA
                  variant="outline"
                  size="sm"
                  label="WhatsApp"
                  template="Hola! Me interesa el paquete {title}."
                  variables={{ title: p.title }}
                  campaign="package_list"
                  content={p.slug}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
