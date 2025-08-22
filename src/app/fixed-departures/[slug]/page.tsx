import prisma from "@/lib/prisma";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Star,
  Share2,
  Plane,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

export default async function FixedDepartureDetailPage({ params }: Params) {
  const { slug } = await params;
  const item = await prisma.fixedDeparture.findUnique({
    where: { slug },
    include: { destination: true },
  });

  if (!item || item.status !== "PUBLISHED") {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const isSameDay =
    new Date(item.startDate).toDateString() ===
    new Date(item.endDate).toDateString();
  const duration = Math.ceil(
    (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {(item as any)?.heroImageUrl ? (
          <Image
            src={(item as any).heroImageUrl}
            alt={item.title}
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
            <Link href="/fixed-departures">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a salidas fijas
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
                <Plane className="h-3 w-3 mr-1" />
                Salida Fija
              </Badge>
              {item.destination?.isFeatured && (
                <Badge className="bg-yellow-500 text-white border-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {item.destination?.city}, {item.destination?.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(item.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {duration} {duration === 1 ? "día" : "días"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Details Card */}
            <Card className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Date and Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Fecha de salida
                    </div>
                    <div className="text-lg">
                      {isSameDay ? (
                        formatDate(item.startDate)
                      ) : (
                        <>
                          {formatDate(item.startDate)} -{" "}
                          {formatDate(item.endDate)}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Duración
                    </div>
                    <div className="text-lg">
                      {duration} {duration === 1 ? "día" : "días"}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Destination Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Destino
                  </h3>
                  <div className="space-y-2">
                    <div className="text-lg font-medium">
                      {item.destination?.city}, {item.destination?.country}
                    </div>
                    {item.destination?.description && (
                      <p className="text-muted-foreground">
                        {item.destination.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Seats Information */}
                {item.seatsInfo && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Disponibilidad
                      </h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-lg">{item.seatsInfo}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Trip Details */}
                {item.detailsJson && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">
                        Detalles del viaje
                      </h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(item.detailsJson, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Related Fixed Departures */}
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold mb-4">
                Otras salidas fijas
              </h3>
              <div className="text-center py-8 text-muted-foreground">
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Próximamente más salidas fijas</p>
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
                      ¿Te interesa esta salida?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Consulta disponibilidad y reserva tu lugar
                    </p>
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
                    className="w-full"
                  />

                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir salida
                  </Button>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Información rápida</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>Salida Fija</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span>
                      {duration} {duration === 1 ? "día" : "días"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destino:</span>
                    <span>{item.destination?.city}</span>
                  </div>
                  {item.destination?.isFeatured && (
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

              {/* Destination Card */}
              {item.destination && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Sobre el destino</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {item.destination.city}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.destination.country}
                        </div>
                      </div>
                    </div>
                    {item.destination.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.destination.description}
                      </p>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/destinations/${item.destination.slug}`}>
                        Ver destino
                      </Link>
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
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
