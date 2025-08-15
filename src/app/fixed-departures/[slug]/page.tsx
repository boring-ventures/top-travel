import prisma from "@/lib/prisma";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";

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
    <div className="container mx-auto py-10 space-y-6">
      {(item as any)?.heroImageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={(item as any).heroImageUrl}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-semibold">{item.title}</h1>
      <div className="text-sm text-muted-foreground">
        {item.destination?.city}, {item.destination?.country}
      </div>
      <div className="text-sm">
        {new Date(item.startDate).toLocaleDateString()} -{" "}
        {new Date(item.endDate).toLocaleDateString()}
      </div>
      {item.detailsJson && (
        <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
          {JSON.stringify(item.detailsJson, null, 2)}
        </pre>
      )}
      {item.seatsInfo && <div className="text-sm">{item.seatsInfo}</div>}
      <div>
        <WhatsAppCTA
          label="WhatsApp us about this departure"
          template="Hola! Me interesa la salida fija {title} en {city}, {country}."
          variables={{
            title: item.title,
            city: item.destination?.city,
            country: item.destination?.country,
          }}
          campaign="fixed_departure_detail"
          content={item.slug}
        />
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
