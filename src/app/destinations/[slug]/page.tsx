import prisma from "@/lib/prisma";
import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Params = { params: Promise<{ slug: string }> };

export default async function DestinationDetailPage({ params }: Params) {
  const { slug } = await params;
  const dest = await prisma.destination.findUnique({
    where: { slug },
    include: {
      destinationTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  if (!dest) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-sm text-muted-foreground">
          Destination not found.
        </div>
      </div>
    );
  }

  const relatedPackages = await prisma.package.findMany({
    where: {
      status: "PUBLISHED",
      packageDestinations: { some: { destinationId: dest.id } },
    },
    take: 12,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8 sm:py-12 space-y-6">
      <section className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl border bg-muted">
        {dest.heroImageUrl ? (
          <Image
            src={dest.heroImageUrl}
            alt={`${dest.city}, ${dest.country}`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {dest.city}, {dest.country}
          </h1>
          {dest.description ? (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-1">
              {dest.description}
            </p>
          ) : null}
          {dest.destinationTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {dest.destinationTags.map((dt) => (
                <Link
                  key={dt.tagId}
                  href={`/tags/${dt.tag.slug}`}
                  className="rounded border px-2 py-1 text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {dt.tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Paquetes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {relatedPackages.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <Link href={`/packages/${p.slug}`} className="block p-4">
                    <div className="font-medium">{p.title}</div>
                    {p.summary ? (
                      <div className="text-sm text-muted-foreground mt-1">
                        {p.summary}
                      </div>
                    ) : null}
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 sticky top-24 space-y-3">
            <div className="text-sm text-muted-foreground">
              Consulta itinerarios personalizados
            </div>
            <WhatsAppCTA
              label="Consultar por WhatsApp"
              template="Hola! Me interesa viajar a {city}, {country}."
              variables={{ city: dest.city, country: dest.country }}
              campaign="destination_detail"
              content={dest.slug}
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
  const dest = await prisma.destination.findUnique({
    where: { slug },
  });
  const title = dest ? `${dest.city}, ${dest.country}` : "Destination";
  const description = dest?.description ?? undefined;
  const image = dest?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/destinations/${slug}`,
    image,
  });
}
