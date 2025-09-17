import prisma from "@/lib/prisma";
import Link from "next/link";
import { ClientWhatsAppCTA } from "@/components/utils/client-whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  Star,
  Share2,
  Package,
  Plane,
  Globe,
  Heart,
  Users,
  Calendar,
  Clock,
  Award,
  Camera,
  Coffee,
  Utensils,
  Car,
  Wifi,
  Shield,
  Compass,
  Navigation,
  Info,
  Phone,
  Mail,
  Zap,
  Gift,
  Sun,
  Moon,
  Bed,
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

  // Fetch WhatsApp template for destinations
  const whatsappTemplate = await getWhatsAppTemplateByUsage("DESTINATIONS");

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
    <div className="min-h-screen bg-gray-50">
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
          <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="backdrop-blur-sm bg-white/80 text-black hover:bg-white/90 border border-black/20"
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
                className="bg-white/20 backdrop-blur-sm text-white border-white/30"
              >
                <Globe className="h-3 w-3 mr-1" />
                Destino
              </Badge>
              {dest.isFeatured && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
              {dest.city}, {dest.country}
            </h1>

            {dest.description && (
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mb-6 drop-shadow-lg">
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
                    className="rounded-full border border-white/30 px-3 py-1 text-sm hover:bg-white hover:text-black transition-colors cursor-pointer bg-white/20 backdrop-blur-sm text-white"
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
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Paquetes disponibles ({relatedPackages.length})
                  </h3>
                  <Button
                    asChild
                    variant="outline"
                    className="hover:bg-emerald-50 hover:border-emerald-300"
                  >
                    <Link href="/packages">
                      <Package className="h-4 w-4 mr-2 text-emerald-600" />
                      Ver todos
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="relative overflow-hidden rounded-xl group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Link href={`/packages/${pkg.slug}`} className="block">
                        <div className="relative h-80 sm:h-96">
                          {pkg.heroImageUrl ? (
                            <Image
                              src={pkg.heroImageUrl}
                              alt={pkg.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 flex items-center justify-center">
                              <div className="bg-emerald-500/20 rounded-full p-6">
                                <Package className="h-12 w-12 text-emerald-600" />
                              </div>
                            </div>
                          )}

                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* Top Glass Content */}
                          <div className="absolute top-0 left-0 right-0 p-4">
                            <div className="flex justify-between items-start">
                              <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-block">
                                <p className="text-white text-sm font-medium">
                                  {pkg.packageDestinations
                                    .slice(0, 2)
                                    .map((pd) => pd.destination.city)
                                    .join(", ")}
                                  {pkg.packageDestinations.length > 2 &&
                                    ` +${pkg.packageDestinations.length - 2} más`}
                                </p>
                              </div>
                              <Badge
                                className={`text-xs font-medium px-3 py-1 backdrop-blur-md ${
                                  pkg.isCustom
                                    ? "bg-amber-500/80 text-white border-amber-300/50"
                                    : "bg-emerald-500/80 text-white border-emerald-300/50"
                                }`}
                              >
                                {pkg.isCustom ? "Personalizado" : "Predefinido"}
                              </Badge>
                            </div>
                          </div>

                          {/* Bottom Glass Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="space-y-3">
                              <h2 className="text-white text-xl font-bold font-serif drop-shadow-lg">
                                {pkg.title}
                              </h2>

                              <p className="text-white text-base font-normal drop-shadow-lg">
                                {pkg.fromPrice
                                  ? `Desde $${pkg.fromPrice.toString()}`
                                  : "Desde $600"}
                              </p>

                              <div className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-2 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2 text-sm">
                                <span>Conoce más</span>
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Fixed Departures */}
            {relatedFixedDepartures.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Salidas fijas ({relatedFixedDepartures.length})
                  </h3>
                  <Button
                    asChild
                    variant="outline"
                    className="hover:bg-violet-50 hover:border-violet-300"
                  >
                    <Link href="/fixed-departures">
                      <Plane className="h-4 w-4 mr-2 text-violet-600" />
                      Ver todas
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {relatedFixedDepartures.map((departure) => (
                    <Card
                      key={departure.id}
                      className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <Link
                        href={`/fixed-departures/${departure.slug}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 group-hover:text-violet-600 transition-colors">
                              {departure.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-black/70">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-indigo-600" />
                                <span>
                                  {new Date(
                                    departure.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    departure.endDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-amber-600" />
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
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-4 hover:bg-violet-50 hover:border-violet-300"
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      ¿Te interesa este destino?
                    </h3>
                    <p className="text-sm text-black/70">
                      Consulta itinerarios personalizados y precios
                    </p>
                  </div>

                  <ClientWhatsAppCTA
                    whatsappTemplate={
                      whatsappTemplate
                        ? {
                            templateBody: whatsappTemplate.templateBody,
                            phoneNumber: whatsappTemplate.phoneNumber,
                            phoneNumbers: whatsappTemplate.phoneNumbers,
                          }
                        : undefined
                    }
                    label="Consultar por WhatsApp"
                    template={
                      whatsappTemplate?.templateBody ||
                      "Hola! Me interesa viajar a {city}, {country}."
                    }
                    variables={{
                      city: dest.city,
                      country: dest.country,
                      itemTitle: `${dest.city}, ${dest.country}`,
                    }}
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
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h4 className="font-semibold mb-4">Información rápida</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-rose-600" />
                      <span className="text-black/70">Ciudad:</span>
                    </div>
                    <span className="font-medium">{dest.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-teal-600" />
                      <span className="text-black/70">País:</span>
                    </div>
                    <span className="font-medium">{dest.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span className="text-black/70">Paquetes:</span>
                    </div>
                    <span className="font-medium">
                      {relatedPackages.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-violet-600" />
                      <span className="text-black/70">Salidas fijas:</span>
                    </div>
                    <span className="font-medium">
                      {relatedFixedDepartures.length}
                    </span>
                  </div>
                  {dest.isFeatured && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="text-black/70">Estado:</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs border border-yellow-300">
                        <Star className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                    </div>
                  )}
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
