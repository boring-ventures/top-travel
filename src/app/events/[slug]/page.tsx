import prisma from "@/lib/prisma";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Params = { params: Promise<{ slug: string }> };

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const evt = await prisma.event.findUnique({ where: { slug } });
  if (!evt || evt.status !== "PUBLISHED") {
    return (
      <div className="container mx-auto py-10">
        <div className="text-sm text-muted-foreground">Event not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 space-y-6">
      <section className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl border bg-muted">
        {(evt as any)?.heroImageUrl ? (
          <Image
            src={(evt as any).heroImageUrl}
            alt={evt.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">{evt.title}</h1>
          <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {evt.locationCity ?? "-"}, {evt.locationCountry ?? "-"}
            {evt.venue ? ` · ${evt.venue}` : ""}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-6">
            <div className="text-sm">
              <span className="font-medium">Fechas:</span>{" "}
              {new Date(evt.startDate).toLocaleDateString()} –{" "}
              {new Date(evt.endDate).toLocaleDateString()}
            </div>
            {evt.detailsJson ? (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Detalles
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
                  {JSON.stringify(evt.detailsJson, null, 2)}
                </pre>
              </div>
            ) : null}
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 sticky top-24 space-y-3">
            <div className="text-sm text-muted-foreground">
              Consulta disponibilidad y precios
            </div>
            <WhatsAppCTA
              label="Consultar por WhatsApp"
              template="Hola! Me interesa el evento {title} en {city}, {country}."
              variables={{
                title: evt.title,
                city: evt.locationCity ?? "",
                country: evt.locationCountry ?? "",
              }}
              campaign="event_detail"
              content={evt.slug}
              size="lg"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const evt = await prisma.event.findUnique({ where: { slug } });
  const title = evt?.title ?? "Event";
  const description = evt?.artistOrEvent
    ? `${evt.artistOrEvent} - ${evt.locationCity ?? ""} ${evt.locationCountry ?? ""}`.trim()
    : undefined;
  const image = (evt as any)?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/events/${slug}`,
    image,
  });
}
