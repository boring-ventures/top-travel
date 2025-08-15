import prisma from "@/lib/prisma";
import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";

type Params = { params: Promise<{ slug: string }> };

export default async function DestinationDetailPage({ params }: Params) {
  const { slug } = await params;
  const dest = await prisma.destination.findUnique({
    where: { slug },
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
    <div className="container mx-auto py-10 space-y-6">
      {dest.heroImageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={dest.heroImageUrl}
            alt={`${dest.city}, ${dest.country}`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-semibold">
        {dest.city}, {dest.country}
      </h1>
      {dest.description && (
        <p className="text-muted-foreground max-w-3xl">{dest.description}</p>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedPackages.map((p) => (
            <Link
              key={p.id}
              href={`/packages/${p.slug}`}
              className="rounded border p-4 hover:bg-neutral-50"
            >
              <div className="font-medium">{p.title}</div>
              {p.summary && (
                <div className="text-sm text-muted-foreground">{p.summary}</div>
              )}
            </Link>
          ))}
        </div>
      </section>
      <div>
        <WhatsAppCTA
          label="WhatsApp us about this destination"
          template="Hola! Me interesa viajar a {city}, {country}."
          variables={{ city: dest.city, country: dest.country }}
          campaign="destination_detail"
          content={dest.slug}
        />
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
