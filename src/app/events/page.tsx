import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";

interface EventsPageProps {
  searchParams?: {
    country?: string;
    city?: string;
    from?: string;
    to?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const country = searchParams?.country || undefined;
  const city = searchParams?.city || undefined;
  const from = searchParams?.from;
  const to = searchParams?.to;

  const where: any = {
    status: "PUBLISHED",
    locationCountry: country,
    locationCity: city,
    ...(from || to
      ? {
          AND: [
            from ? { endDate: { gte: new Date(from) } } : {},
            to ? { startDate: { lte: new Date(to) } } : {},
          ],
        }
      : {}),
  };

  const events = await prisma.event.findMany({
    where,
    orderBy: { startDate: "asc" },
    take: 50,
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Events</h1>
      <form className="grid grid-cols-1 md:grid-cols-4 gap-3" method="get">
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
        <div className="md:col-span-4">
          <button className="rounded bg-black text-white px-4 py-2 text-sm">
            Filter
          </button>
        </div>
      </form>

      {events.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No events match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <div key={e.id} className="rounded border p-4 hover:bg-neutral-50">
              <Link href={`/events/${e.slug}`} className="block">
                {(e as any).heroImageUrl && (
                  <div className="relative w-full h-40 mb-3 overflow-hidden rounded">
                    <Image
                      src={(e as any).heroImageUrl}
                      alt={e.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="font-medium">{e.title}</div>
                <div className="text-sm text-muted-foreground">
                  {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
                </div>
              </Link>
              <div className="mt-3">
                <WhatsAppCTA
                  variant="outline"
                  size="sm"
                  label="WhatsApp"
                  template="Hola! Me interesa el evento {title}."
                  variables={{ title: e.title }}
                  campaign="event_list"
                  content={e.slug}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
