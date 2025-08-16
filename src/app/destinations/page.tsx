import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { isValidImageUrl } from "@/lib/utils";

interface DestinationsPageProps {
  searchParams?: Promise<{
    country?: string;
    city?: string;
    featured?: string;
  }>;
}

export default async function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const params = await searchParams;
  const country = params?.country || undefined;
  const city = params?.city || undefined;
  const isFeatured = params?.featured === "true" ? true : undefined;

  const where: any = { country, city, isFeatured };
  const destinations = await prisma.destination.findMany({
    where,
    orderBy: [{ country: "asc" }, { city: "asc" }],
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Destinos
      </h1>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-3" method="get">
        <input
          name="country"
          placeholder="Country"
          className="w-full rounded border px-3 py-2 text-sm"
          defaultValue={country ?? ""}
        />
        <input
          name="city"
          placeholder="City"
          className="w-full rounded border px-3 py-2 text-sm"
          defaultValue={city ?? ""}
        />
        <select
          name="featured"
          className="w-full rounded border px-3 py-2 text-sm"
          defaultValue={isFeatured === true ? "true" : ""}
        >
          <option value="">All</option>
          <option value="true">Featured only</option>
        </select>
        <div className="md:col-span-3">
          <button className="rounded bg-black text-white px-4 py-2 text-sm">
            Filter
          </button>
        </div>
      </form>

      {destinations.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No destinations match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {destinations.map((d) => (
            <Card key={d.id} className="overflow-hidden">
              <Link href={`/destinations/${d.slug}`} className="block">
                <div className="relative w-full h-28">
                  {d.heroImageUrl && isValidImageUrl(d.heroImageUrl) ? (
                    <Image
                      src={d.heroImageUrl}
                      alt={`${d.city}, ${d.country}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-3 text-xs sm:text-sm">
                  {d.city}, {d.country}
                </div>
              </Link>
              <div className="px-3 pb-3">
                <WhatsAppCTA
                  variant="outline"
                  size="sm"
                  label="WhatsApp"
                  template="Hola! Me interesa viajar a {city}, {country}."
                  variables={{ city: d.city, country: d.country }}
                  campaign="destination_list"
                  content={d.slug}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
