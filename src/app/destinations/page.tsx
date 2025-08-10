import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";

interface DestinationsPageProps {
  searchParams?: { country?: string; city?: string; featured?: string };
}

export default async function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const country = searchParams?.country || undefined;
  const city = searchParams?.city || undefined;
  const isFeatured = searchParams?.featured === "true" ? true : undefined;

  const where: any = { country, city, isFeatured };
  const destinations = await prisma.destination.findMany({
    where,
    orderBy: [{ country: "asc" }, { city: "asc" }],
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Destinations</h1>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="rounded border p-3 hover:bg-neutral-50 text-sm"
            >
              <Link href={`/destinations/${d.slug}`} className="block">
                {d.heroImageUrl && (
                  <div className="relative w-full h-28 mb-2 overflow-hidden rounded">
                    <Image
                      src={d.heroImageUrl}
                      alt={`${d.city}, ${d.country}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                )}
                {d.city}, {d.country}
              </Link>
              <div className="mt-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
