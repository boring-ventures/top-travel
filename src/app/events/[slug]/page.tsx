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
  Share2,
  Star,
  Heart,
  Globe,
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
  Music,
  Mic,
  Sparkles,
  Trophy,
  Palette,
  Package,
  Plane,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const evt = await prisma.event.findUnique({ where: { slug } });

  if (!evt || evt.status !== "PUBLISHED") {
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
    new Date(evt.startDate).toDateString() ===
    new Date(evt.endDate).toDateString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {(evt as any)?.heroImageUrl ? (
          <Image
            src={(evt as any).heroImageUrl}
            alt={evt.title}
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
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
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
                Evento
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
              {evt.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/80" />
                <span>
                  {evt.locationCity ?? "Ubicación por confirmar"},{" "}
                  {evt.locationCountry ?? ""}
                  {evt.venue && ` · ${evt.venue}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/80" />
                <span>{formatDate(evt.startDate)}</span>
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
            {/* Event Details Card */}
            <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="space-y-6">
                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-black/5 rounded-xl border border-black/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-black/60" />
                      </div>
                      <span className="font-semibold text-black/80">Fecha</span>
                    </div>
                    <div className="text-lg font-medium text-black/90">
                      {isSameDay ? (
                        formatDate(evt.startDate)
                      ) : (
                        <>
                          {formatDate(evt.startDate)} -{" "}
                          {formatDate(evt.endDate)}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-black/5 rounded-xl border border-black/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-black/60" />
                      </div>
                      <span className="font-semibold text-black/80">Horario</span>
                    </div>
                    <div className="text-lg font-medium text-black/90">
                      {formatTime(evt.startDate)} - {formatTime(evt.endDate)}
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-black/20 to-transparent" />

                {/* Location Details */}
                <div className="p-6 bg-black/5 rounded-xl border border-black/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-black/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-black/80">Ubicación</h3>
                  </div>
                  <div className="space-y-2">
                    {evt.venue && (
                      <div className="text-lg font-medium text-black/90">{evt.venue}</div>
                    )}
                    <div className="text-black/70">
                      {evt.locationCity}, {evt.locationCountry}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                {evt.detailsJson && (
                  <>
                    <Separator className="bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                    <div className="p-6 bg-black/5 rounded-xl border border-black/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center">
                          <Info className="h-6 w-6 text-black/60" />
                        </div>
                        <h3 className="text-xl font-semibold text-black/80">Detalles del evento</h3>
                      </div>
                      <div className="bg-white/60 p-4 rounded-lg border border-black/10 backdrop-blur-sm">
                        <pre className="whitespace-pre-wrap text-sm text-black/90">
                          {JSON.stringify(evt.detailsJson, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6 bg-white/90 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      ¿Te interesa este evento?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Consulta disponibilidad, precios y reserva tu lugar
                    </p>
                  </div>

                  <WhatsAppCTA
                    label="Consultar por WhatsApp"
                    template="Hola! Me interesa el evento {title} en {city}, {country}."
                    variables={{
                      title: evt.title,
                      city: evt.locationCity ?? "",
                      country: evt.locationCountry ?? "",
                    }}
                    campaign="event_detail"
                    content={evt.slug}
                    size="lg"
                    className="w-full"
                  />

                  <Button variant="outline" size="sm" className="w-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir evento
                  </Button>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6 bg-white/90 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-black/80">
                  <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center">
                    <Info className="h-4 w-4 text-black/60" />
                  </div>
                  Información rápida
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-black/5 rounded-lg border border-black/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-black/60" />
                        <span className="text-black/70 font-medium">Tipo:</span>
                      </div>
                      <span className="font-semibold text-black/90">Evento</span>
                    </div>
                  </div>
                  <div className="p-3 bg-black/5 rounded-lg border border-black/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-black/60" />
                        <span className="text-black/70 font-medium">Duración:</span>
                  </div>
                      <span className="font-semibold text-black/90">
                      {isSameDay
                        ? "1 día"
                        : `${Math.ceil((new Date(evt.endDate).getTime() - new Date(evt.startDate).getTime()) / (1000 * 60 * 60 * 24))} días`}
                    </span>
                    </div>
                  </div>
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
  const evt = await prisma.event.findUnique({ where: { slug } });
  const title = evt?.title ?? "Event";
  const description = evt?.artistOrEvent
    ? `${evt.artistOrEvent} - ${evt.locationCity ?? ""} ${evt.locationCountry ?? ""}`.trim()
    : undefined;
  const image = (evt as any)?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/events/${slug}`,
    image,
  });
}
