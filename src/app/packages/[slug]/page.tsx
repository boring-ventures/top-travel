import prisma from "@/lib/prisma";
import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Params = { params: Promise<{ slug: string }> };

export default async function PackageDetailPage({ params }: Params) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      packageDestinations: { include: { destination: true } },
      packageTags: { include: { tag: true } },
    },
  });

  if (!pkg || pkg.status !== "PUBLISHED") {
    return (
      <div className="container mx-auto py-10">
        <div className="text-sm text-muted-foreground">Package not found.</div>
      </div>
    );
  }

  const destinations = pkg.packageDestinations.map((pd) => pd.destination);
  const tags = pkg.packageTags.map((pt) => pt.tag);

  return (
    <div className="container mx-auto py-8 sm:py-12 space-y-6">
      <section className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl border bg-muted">
        {pkg.heroImageUrl ? (
          <Image
            src={pkg.heroImageUrl}
            alt={pkg.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">{pkg.title}</h1>
          {pkg.summary ? (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-1">
              {pkg.summary}
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4 sm:p-6 space-y-3">
            <div className="flex flex-wrap gap-2 text-sm">
              {destinations.map((d) => (
                <span key={d.id} className="rounded border px-2 py-1">
                  {d.city}, {d.country}
                </span>
              ))}
              {tags.map((t) => (
                <span key={t.id} className="rounded border px-2 py-1">
                  {t.name}
                </span>
              ))}
            </div>
            <div className="text-sm">
              {pkg.isCustom ? (
                <span className="font-medium">Paquete personalizado</span>
              ) : (
                <span>
                  Desde {pkg.currency ?? "USD"}{" "}
                  {pkg.fromPrice?.toString() ?? "—"}
                </span>
              )}
            </div>
          </Card>

          {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? (
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-2">Incluye</h2>
              <ul className="list-disc pl-6 text-sm space-y-1">
                {pkg.inclusions.map((inc, idx) => (
                  <li key={idx}>{inc}</li>
                ))}
              </ul>
            </Card>
          ) : null}

          {Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0 ? (
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-2">No incluye</h2>
              <ul className="list-disc pl-6 text-sm space-y-1">
                {pkg.exclusions.map((exc, idx) => (
                  <li key={idx}>{exc}</li>
                ))}
              </ul>
            </Card>
          ) : null}

          {pkg.itineraryJson ? (
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-2">Itinerario</h2>
              <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
                {JSON.stringify(pkg.itineraryJson, null, 2)}
              </pre>
            </Card>
          ) : null}
        </div>
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 sticky top-24 space-y-3">
            <div className="text-sm text-muted-foreground">
              Consulta este paquete
            </div>
            <WhatsAppCTA
              label="Consultar por WhatsApp"
              template="Hola! Me interesa el paquete {title}."
              variables={{ title: pkg.title, slug: pkg.slug }}
              campaign="package_detail"
              content={pkg.slug}
              size="lg"
            />
            <Link
              href="/packages"
              className="text-sm underline underline-offset-4 text-primary"
            >
              Ver más paquetes
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  const title = pkg?.title ? `${pkg.title}` : "Package";
  const description = pkg?.summary ?? undefined;
  const image = pkg?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/packages/${slug}`,
    image,
  });
}
