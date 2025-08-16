import prisma from "@/lib/prisma";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Params = { params: Promise<{ slug: string }> };

export default async function FixedDepartureDetailPage({ params }: Params) {
  const { slug } = await params;
  const item = await prisma.fixedDeparture.findUnique({
    where: { slug },
    include: { destination: true },
  });
  if (!item || item.status !== "PUBLISHED") {
    return (
      <div className="container mx-auto py-10">
        <div className="text-sm text-muted-foreground">
          Fixed departure not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 space-y-6">
      <section className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl border bg-muted">
        {(item as any)?.heroImageUrl ? (
          <Image
            src={(item as any).heroImageUrl}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">{item.title}</h1>
          <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {item.destination?.city}, {item.destination?.country}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-6 space-y-2">
            <div className="text-sm">
              <span className="font-medium">Fechas:</span>{" "}
              {new Date(item.startDate).toLocaleDateString()} –{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </div>
            {item.seatsInfo ? (
              <div className="text-sm">
                <span className="font-medium">Cupos:</span> {item.seatsInfo}
              </div>
            ) : null}
            {item.detailsJson ? (
              <div className="mt-2">
                <div className="text-sm text-muted-foreground mb-2">
                  Detalles
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
                  {JSON.stringify(item.detailsJson, null, 2)}
                </pre>
              </div>
            ) : null}
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 sticky top-24 space-y-3">
            <div className="text-sm text-muted-foreground">
              Consulta disponibilidad
            </div>
            <WhatsAppCTA
              label="Consultar por WhatsApp"
              template="Hola! Me interesa la salida fija {title} en {city}, {country}."
              variables={{
                title: item.title,
                city: item.destination?.city,
                country: item.destination?.country,
              }}
              campaign="fixed_departure_detail"
              content={item.slug}
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
  const item = await prisma.fixedDeparture.findUnique({
    where: { slug },
    include: { destination: true },
  });
  const title = item?.title ?? "Fixed Departure";
  const description = item?.destination
    ? `${item.destination.city}, ${item.destination.country}`
    : undefined;
  const image = (item as any).heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/fixed-departures/${slug}`,
    image,
  });
}
