import prisma from "@/lib/prisma";
import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";

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
    <div className="container mx-auto py-10 space-y-6">
      {pkg.heroImageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={pkg.heroImageUrl}
            alt={pkg.title}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{pkg.title}</h1>
        {pkg.summary && (
          <p className="text-muted-foreground max-w-3xl">{pkg.summary}</p>
        )}
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
            <span className="font-medium">Custom package</span>
          ) : (
            <span>
              From {pkg.currency ?? "USD"} {pkg.fromPrice?.toString() ?? "—"}
            </span>
          )}
        </div>
      </div>

      {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Inclusions</h2>
          <ul className="list-disc pl-6 text-sm space-y-1">
            {pkg.inclusions.map((inc, idx) => (
              <li key={idx}>{inc}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Exclusions</h2>
          <ul className="list-disc pl-6 text-sm space-y-1">
            {pkg.exclusions.map((exc, idx) => (
              <li key={idx}>{exc}</li>
            ))}
          </ul>
        </section>
      )}

      {pkg.itineraryJson && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Itinerary</h2>
          <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
            {JSON.stringify(pkg.itineraryJson, null, 2)}
          </pre>
        </section>
      )}

      <div>
        <WhatsAppCTA
          label="WhatsApp us about this package"
          template="Hola! Me interesa el paquete {title}."
          variables={{ title: pkg.title, slug: pkg.slug }}
          campaign="package_detail"
          content={pkg.slug}
        />
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
