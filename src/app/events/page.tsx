import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Filter,
  Music,
  Sparkles,
  Compass,
} from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { ShineBorder } from "@/components/magicui/shine-border";

interface EventsPageProps {
  searchParams?: Promise<{
    country?: string;
    city?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const country = params?.country || undefined;
  const city = params?.city || undefined;
  const from = params?.from;
  const to = params?.to;

  const where: any = {
    status: "PUBLISHED",
    locationCountry: country === "all" ? undefined : country,
    locationCity: city,
    ...(from || to
      ? {
          AND: [
            from ? { endDate: { gte: new Date(from) } } : {},
            to ? { startDate: { lte: new Date(to) } } : {},
          ],
        }
      : {}),
  };

  // Debug: Log the where clause and count total published events
  console.log("Events where clause:", JSON.stringify(where, null, 2));

  // Get total count of published events for debugging
  const totalPublishedEvents = await prisma.event.count({
    where: { status: "PUBLISHED" },
  });
  console.log("Total published events in database:", totalPublishedEvents);

  const events = await prisma.event.findMany({
    where,
    orderBy: { startDate: "asc" },
    take: 100, // Increased limit to ensure we get all events
  });

  // Debug: Log the events being returned
  console.log("Events returned:", events.length);
  console.log(
    "Events titles:",
    events.map((e) => e.title)
  );

  // Get unique countries and cities for filters
  const allEvents = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { locationCountry: true, locationCity: true },
    orderBy: [{ locationCountry: "asc" }, { locationCity: "asc" }],
  });

  const countries = [
    ...new Set(allEvents.map((e) => e.locationCountry)),
  ].filter((c): c is string => Boolean(c));
  const cities = [...new Set(allEvents.map((e) => e.locationCity))].filter(
    Boolean
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getEventStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "past";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Conciertos & Eventos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Inolvidables
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Vive experiencias únicas con los mejores conciertos y eventos.
                Desde música en vivo hasta festivales internacionales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Eventos exclusivos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Fechas especiales</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Search and Filters */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
            <Card className="p-6 sm:p-8 bg-transparent border-0 shadow-xl">
              <form className="space-y-6" method="get">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                    <Input
                      name="city"
                      placeholder="Buscar ciudad..."
                      className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200"
                      defaultValue={city ?? ""}
                    />
                  </div>
                  <Select name="country" defaultValue={country || "all"}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-200">
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los países</SelectItem>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    name="from"
                    placeholder="Desde"
                    className="h-12 border-2 focus:border-primary transition-all duration-200"
                    defaultValue={from ?? ""}
                  />
                  <Input
                    type="date"
                    name="to"
                    placeholder="Hasta"
                    className="h-12 border-2 focus:border-primary transition-all duration-200"
                    defaultValue={to ?? ""}
                  />
                  <Button
                    type="submit"
                    className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </form>
            </Card>
          </ShineBorder>
        </section>

        {/* Events Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground mb-6">
                <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  No se encontraron eventos
                </h3>
                <p className="text-lg max-w-md mx-auto text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda o consulta con
                  nosotros para eventos próximos
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/contact">Contactar</Link>
                  </Button>
                  <WhatsAppCTA
                    template="Hola! Quiero información sobre eventos próximos."
                    variables={{}}
                    label="Consultar por WhatsApp"
                    size="default"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                    {events.length} evento{events.length !== 1 ? "s" : ""}{" "}
                    encontrado{events.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-muted-foreground">
                    Descubre los mejores eventos y conciertos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {events.map((event) => {
                  const status = getEventStatus(event.startDate, event.endDate);
                  const isUpcoming = status === "upcoming";
                  const isOngoing = status === "ongoing";

                  return (
                    <Card
                      key={event.id}
                      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm flex flex-col"
                    >
                      <Link
                        href={`/events/${event.slug}`}
                        className="block flex-1"
                      >
                        <div className="relative w-full h-56 overflow-hidden">
                          {(event as any)?.heroImageUrl &&
                          isValidImageUrl((event as any).heroImageUrl) ? (
                            <Image
                              src={(event as any).heroImageUrl}
                              alt={event.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                              <Music className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge
                              variant={
                                isOngoing
                                  ? "default"
                                  : isUpcoming
                                    ? "secondary"
                                    : "outline"
                              }
                              className={`text-xs shadow-lg ${
                                isOngoing
                                  ? "bg-green-500"
                                  : isUpcoming
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                              }`}
                            >
                              {isOngoing
                                ? "En curso"
                                : isUpcoming
                                  ? "Próximo"
                                  : "Finalizado"}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm font-medium">
                              Haz clic para más detalles
                            </p>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-xl mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 text-foreground">
                            {event.title}
                          </h3>

                          <div className="flex-1">
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(event.startDate)}</span>
                                {event.endDate &&
                                  event.endDate !== event.startDate && (
                                    <span> - {formatDate(event.endDate)}</span>
                                  )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {event.locationCity}, {event.locationCountry}
                                </span>
                              </div>
                              {(event as any)?.amenities &&
                                (event as any).amenities.length > 0 && (
                                  <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                                    {(event as any).amenities
                                      .slice(0, 3)
                                      .map((amenity: string, index: number) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                                        >
                                          {amenity}
                                        </span>
                                      ))}
                                    {(event as any).amenities.length > 3 && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        +{(event as any).amenities.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="px-5 pb-5 mt-auto">
                        <WhatsAppCTA
                          variant="outline"
                          size="sm"
                          label="Consultar por WhatsApp"
                          template="Hola! Me interesa el evento {title}."
                          variables={{ title: event.title }}
                          campaign="event_list"
                          content={event.slug}
                          className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
