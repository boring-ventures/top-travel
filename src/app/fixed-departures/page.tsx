import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { isValidImageUrl } from "@/lib/utils";

interface FDPageProps {
  searchParams?: Promise<{
    destinationId?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function FixedDeparturesPage({
  searchParams,
}: FDPageProps) {
  const params = await searchParams;
  const destinationId = params?.destinationId || undefined;
  const from = params?.from;
  const to = params?.to;

  const where: any = {
    status: "PUBLISHED",
    destinationId,
    ...(from || to
      ? {
          AND: [
            from ? { endDate: { gte: new Date(from) } } : {},
            to ? { startDate: { lte: new Date(to) } } : {},
          ],
        }
      : {}),
  };

  const [items, destinations] = await Promise.all([
    prisma.fixedDeparture.findMany({
      where,
      orderBy: { startDate: "asc" },
      take: 50,
    }),
    prisma.destination.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }],
    }),
  ]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Salidas fijas
      </h1>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-3" method="get">
        <select
          name="destinationId"
          className="w-full rounded border px-3 py-2 text-sm"
          defaultValue={destinationId ?? ""}
        >
          <option value="">All destinations</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.city}, {d.country}
            </option>
          ))}
        </select>
        <input
          name="from"
          type="date"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <input
          name="to"
          type="date"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <div className="md:col-span-3">
          <button className="rounded bg-black text-white px-4 py-2 text-sm">
            Filter
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No fixed departures match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((f) => (
            <Card key={f.id} className="overflow-hidden">
              <Link href={`/fixed-departures/${f.slug}`} className="block">
                <div className="relative w-full h-40">
                  {(f as any).heroImageUrl && isValidImageUrl((f as any).heroImageUrl) ? (
                    <Image
                      src={(f as any).heroImageUrl}
                      alt={f.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium">{f.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(f.startDate).toLocaleDateString()} -{" "}
                    {new Date(f.endDate).toLocaleDateString()}
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <WhatsAppCTA
                  variant="outline"
                  size="sm"
                  label="WhatsApp"
                  template="Hola! Me interesa la salida fija {title}."
                  variables={{ title: f.title }}
                  campaign="fixed_departure_list"
                  content={f.slug}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
