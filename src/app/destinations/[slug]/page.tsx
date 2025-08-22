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
  Plane,
  Globe,
  Heart,
} from "lucide-react";
import { notFound } from "next/navigation";

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
    notFound();
  }

  const relatedPackages = await prisma.package.findMany({
    where: {
      status: "PUBLISHED",
      packageDestinations: { some: { destinationId: dest.id } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      packageDestinations: {
        include: {
          destination: true,
        },
      },
    },
  });

  const relatedFixedDepartures = await prisma.fixedDeparture.findMany({
    where: {
      status: "PUBLISHED",
      destinationId: dest.id,
    },
    take: 3,
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        {dest.heroImageUrl ? (
          <Image
            src={dest.heroImageUrl}
            alt={`${dest.city}, ${dest.country}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600" />
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
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a destinos
            </Link>
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-blue-600 border-blue-500/30"
              >
                <Globe className="h-3 w-3 mr-1" />
                Destino
              </Badge>
              {dest.isFeatured && (
                <Badge className="bg-yellow-500 text-white border-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {dest.city}, {dest.country}
            </h1>

            {dest.description && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-6">
                {dest.description}
              </p>
            )}

            {/* Tags */}
            {dest.destinationTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dest.destinationTags.map((dt) => (
                  <Link
                    key={dt.tagId}
                    href={`/tags/${dt.tag.slug}`}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer bg-background/80 backdrop-blur-sm"
                  >
                    {dt.tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Destination Info Card */}
            <Card className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{dest.city}</h2>
                    <p className="text-muted-foreground">{dest.country}</p>
                  </div>
                </div>

                {dest.description && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">
                        Sobre este destino
                      </h3>
                      <p className="text-lg leading-relaxed">
                        {dest.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Tags Section */}
                {dest.destinationTags.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Características</h3>
                      <div className="flex flex-wrap gap-2">
                        {dest.destinationTags.map((dt) => (
                          <Link
                            key={dt.tagId}
                            href={`/tags/${dt.tag.slug}`}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                          >
                            {dt.tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <Card className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Paquetes disponibles ({relatedPackages.length})
                  </h3>
                  <Button asChild variant="outline">
                    <Link href="/packages">Ver todos</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <Link href={`/packages/${pkg.slug}`} className="block">
                        <div className="relative w-full h-48 overflow-hidden">
                          {pkg.heroImageUrl ? (
                            <Image
                              src={pkg.heroImageUrl}
                              alt={pkg.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant={pkg.isCustom ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {pkg.isCustom ? "Personalizado" : "Predefinido"}
                            </Badge>
                          </div>
                          {pkg.fromPrice && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-white/90 text-black hover:bg-white text-xs">
                                Desde ${pkg.fromPrice.toString()}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {pkg.title}
                          </h4>
                          {pkg.summary && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {pkg.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {pkg.packageDestinations
                                .slice(0, 2)
                                .map((pd) => pd.destination.city)
                                .join(", ")}
                              {pkg.packageDestinations.length > 2 &&
                                ` +${pkg.packageDestinations.length - 2} más`}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <WhatsAppCTA
                          variant="outline"
                          size="sm"
                          label="Consultar"
                          template="Hola! Me interesa el paquete {title} para {city}, {country}."
                          variables={{
                            title: pkg.title,
                            city: dest.city,
                            country: dest.country,
                          }}
                          campaign="destination_detail"
                          content={`${dest.slug}_${pkg.slug}`}
                          className="w-full"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Related Fixed Departures */}
            {relatedFixedDepartures.length > 0 && (
              <Card className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Plane className="h-6 w-6" />
                    Salidas fijas ({relatedFixedDepartures.length})
                  </h3>
                  <Button asChild variant="outline">
                    <Link href="/fixed-departures">Ver todas</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {relatedFixedDepartures.map((departure) => (
                    <Card
                      key={departure.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <Link
                        href={`/fixed-departures/${departure.slug}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg mb-1">
                              {departure.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {new Date(
                                  departure.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  departure.endDate
                                ).toLocaleDateString()}
                              </span>
                              <span>
                                {Math.ceil(
                                  (new Date(departure.endDate).getTime() -
                                    new Date(departure.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                días
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      ¿Te interesa este destino?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Consulta itinerarios personalizados y precios
                    </p>
                  </div>

                  <WhatsAppCTA
                    label="Consultar por WhatsApp"
                    template="Hola! Me interesa viajar a {city}, {country}."
                    variables={{ city: dest.city, country: dest.country }}
                    campaign="destination_detail"
                    content={dest.slug}
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
                    <span className="text-muted-foreground">Ciudad:</span>
                    <span>{dest.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">País:</span>
                    <span>{dest.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paquetes:</span>
                    <span>{relatedPackages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Salidas fijas:
                    </span>
                    <span>{relatedFixedDepartures.length}</span>
                  </div>
                  {dest.isFeatured && (
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

              {/* Related Destinations */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Destinos relacionados</h4>
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link href="/destinations">
                      <Globe className="h-4 w-4 mr-2" />
                      Ver todos los destinos
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link href="/packages">
                      <Package className="h-4 w-4 mr-2" />
                      Explorar paquetes
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
