import prisma from "@/lib/prisma";
import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowLeft,
  Star,
  Share2,
  Package,
  DollarSign,
  Calendar,
  Clock,
  Check,
  X,
  Heart,
  Plane,
} from "lucide-react";
import { notFound } from "next/navigation";

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
    notFound();
  }

  // Convert Decimal objects to numbers for client components
  const pkgWithNumbers = {
    ...pkg,
    fromPrice: pkg.fromPrice ? Number(pkg.fromPrice) : undefined,
  };

  const destinations = pkgWithNumbers.packageDestinations.map(
    (pd) => pd.destination
  );
  const tags = pkgWithNumbers.packageTags.map((pt) => pt.tag);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {pkgWithNumbers.heroImageUrl ? (
          <Image
            src={pkgWithNumbers.heroImageUrl}
            alt={pkgWithNumbers.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="backdrop-blur-sm bg-background/80"
          >
            <Link href="/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a paquetes
            </Link>
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-600 border-green-500/30"
              >
                <Package className="h-3 w-3 mr-1" />
                {pkgWithNumbers.isCustom ? "Paquete Personalizado" : "Paquete"}
              </Badge>
              {pkgWithNumbers.isFeatured && (
                <Badge className="bg-yellow-500 text-white border-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {pkgWithNumbers.title}
            </h1>

            {pkgWithNumbers.summary && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-6">
                {pkgWithNumbers.summary}
              </p>
            )}

            {/* Price and Destinations */}
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              {pkgWithNumbers.fromPrice && (
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">
                    Desde {pkgWithNumbers.currency ?? "USD"}{" "}
                    {pkgWithNumbers.fromPrice.toString()}
                  </span>
                </div>
              )}
              {destinations.length > 0 && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {destinations
                      .slice(0, 2)
                      .map((d) => d.city)
                      .join(", ")}
                    {destinations.length > 2 &&
                      ` +${destinations.length - 2} más`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Details Card */}
            <Card className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Destinations and Tags */}
                <div className="space-y-4">
                  {destinations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Destinos incluidos
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {destinations.map((d) => (
                          <Link
                            key={d.id}
                            href={`/destinations/${d.slug}`}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                          >
                            {d.city}, {d.country}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Etiquetas</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <Link
                            key={t.id}
                            href={`/tags/${t.slug}`}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                          >
                            {t.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Información de precios
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    {pkgWithNumbers.isCustom ? (
                      <p className="text-lg">
                        Paquete personalizado - Consulta precios
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Precio desde:
                          </span>
                          <span className="text-2xl font-bold">
                            {pkgWithNumbers.currency ?? "USD"}{" "}
                            {pkgWithNumbers.fromPrice?.toString() ?? "—"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          * Los precios pueden variar según la temporada y
                          disponibilidad
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Inclusions */}
            {Array.isArray(pkgWithNumbers.inclusions) &&
              pkgWithNumbers.inclusions.length > 0 && (
                <Card className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Incluye
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkgWithNumbers.inclusions.map((inc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                      >
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{inc}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Exclusions */}
            {Array.isArray(pkgWithNumbers.exclusions) &&
              pkgWithNumbers.exclusions.length > 0 && (
                <Card className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <X className="h-5 w-5 text-red-600" />
                    No incluye
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkgWithNumbers.exclusions.map((exc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                      >
                        <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm">{exc}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Itinerary */}
            {pkg.itineraryJson && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold mb-4">Itinerario</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(pkg.itineraryJson, null, 2)}
                  </pre>
                </div>
              </Card>
            )}

            {/* Related Packages */}
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-4">
                Paquetes relacionados
              </h3>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Próximamente más paquetes</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      ¿Te interesa este paquete?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Consulta disponibilidad, precios y reserva
                    </p>
                  </div>

                  <WhatsAppCTA
                    label="Consultar por WhatsApp"
                    template="Hola! Me interesa el paquete {title}."
                    variables={{ title: pkg.title, slug: pkg.slug }}
                    campaign="package_detail"
                    content={pkg.slug}
                    size="lg"
                    className="w-full"
                  />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Información rápida</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>
                      {pkgWithNumbers.isCustom
                        ? "Personalizado"
                        : "Predefinido"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destinos:</span>
                    <span>{destinations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Etiquetas:</span>
                    <span>{tags.length}</span>
                  </div>
                  {pkgWithNumbers.fromPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Precio desde:
                      </span>
                      <span className="font-semibold">
                        {pkgWithNumbers.currency ?? "USD"}{" "}
                        {pkgWithNumbers.fromPrice.toString()}
                      </span>
                    </div>
                  )}
                  {pkgWithNumbers.isFeatured && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge className="bg-yellow-500 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Destinations Card */}
              {destinations.length > 0 && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Destinos incluidos</h4>
                  <div className="space-y-3">
                    {destinations.slice(0, 3).map((destination) => (
                      <div
                        key={destination.id}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {destination.city}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {destination.country}
                          </div>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/destinations/${destination.slug}`}>
                            Ver
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {destinations.length > 3 && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Link href="/destinations">Ver todos los destinos</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              )}

              {/* Related Links */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Explorar más</h4>
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link href="/packages">
                      <Package className="h-4 w-4 mr-2" />
                      Ver todos los paquetes
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link href="/destinations">
                      <MapPin className="h-4 w-4 mr-2" />
                      Explorar destinos
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link href="/fixed-departures">
                      <Plane className="h-4 w-4 mr-2" />
                      Ver salidas fijas
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
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
