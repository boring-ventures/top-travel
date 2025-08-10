import prisma from "@/lib/prisma";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";

type Params = { params: { slug: string } };

export default async function EventDetailPage({ params }: Params) {
  const evt = await prisma.event.findUnique({ where: { slug: params.slug } });
  if (!evt || evt.status !== "PUBLISHED") {
    return (
      <div className="container mx-auto py-10">
        <div className="text-sm text-muted-foreground">Event not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      {(evt as any)?.heroImageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={(evt as any).heroImageUrl}
            alt={evt.title}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-semibold">{evt.title}</h1>
      <div className="text-sm text-muted-foreground">
        {evt.locationCity ?? "-"}, {evt.locationCountry ?? "-"}{" "}
        {evt.venue ? `· ${evt.venue}` : ""}
      </div>
      <div className="text-sm">
        {new Date(evt.startDate).toLocaleDateString()} -{" "}
        {new Date(evt.endDate).toLocaleDateString()}
      </div>
      {evt.detailsJson && (
        <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
          {JSON.stringify(evt.detailsJson, null, 2)}
        </pre>
      )}
      <div>
        <WhatsAppCTA
          label="WhatsApp us about this event"
          template="Hola! Me interesa el evento {title} en {city}, {country}."
          variables={{
            title: evt.title,
            city: evt.locationCity ?? "",
            country: evt.locationCountry ?? "",
          }}
          campaign="event_detail"
          content={evt.slug}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const evt = await prisma.event.findUnique({ where: { slug: params.slug } });
  const title = evt?.title ?? "Event";
  const description = evt?.artistOrEvent
    ? `${evt.artistOrEvent} - ${evt.locationCity ?? ""} ${evt.locationCountry ?? ""}`.trim()
    : undefined;
  const image = (evt as any)?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/events/${params.slug}`,
    image,
  });
}
