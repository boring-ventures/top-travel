import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { isValidImageUrl } from "@/lib/utils";

interface EventsPageProps {
  searchParams?: Promise<{
    country?: string;
    city?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const country = params?.country || undefined;
  const city = params?.city || undefined;
  const from = params?.from;
  const to = params?.to;

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
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Eventos
      </h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {events.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              <Link href={`/events/${e.slug}`} className="block">
                <div className="relative w-full h-40">
                  {(e as any).heroImageUrl && isValidImageUrl((e as any).heroImageUrl) ? (
                    <Image
                      src={(e as any).heroImageUrl}
                      alt={e.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
