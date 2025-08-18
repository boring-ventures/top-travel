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
import { Search, Calendar, MapPin, Clock, Filter } from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";

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

  const events = await prisma.event.findMany({
    where,
    orderBy: { startDate: "asc" },
    take: 50,
  });

  // Get unique countries and cities for filters
  const allEvents = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { locationCountry: true, locationCity: true },
    orderBy: [{ locationCountry: "asc" }, { locationCity: "asc" }],
  });

  const countries = [
    ...new Set(allEvents.map((e) => e.locationCountry)),
  ].filter(Boolean);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Conciertos & Eventos
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Descubre los mejores eventos y conciertos en Bolivia y el mundo
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <form className="space-y-4" method="get">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    name="city"
                    placeholder="Buscar ciudad..."
                    className="pl-10"
                    defaultValue={city ?? ""}
                  />
                </div>
                <Select
                  name="country"
                  defaultValue={country !== null ? country : "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los países</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c || ""}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="from"
                  type="date"
                  placeholder="Desde"
                  className="w-full"
                  defaultValue={from ?? ""}
                />
                <Input
                  name="to"
                  type="date"
                  placeholder="Hasta"
                  className="w-full"
                  defaultValue={to ?? ""}
                />
                <Button type="submit" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Events Grid */}
        <section className="container mx-auto px-4 pb-16">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  No se encontraron eventos
                </h3>
                <p className="text-sm">
                  Intenta ajustar tus filtros de búsqueda
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {events.length} evento{events.length !== 1 ? "s" : ""}{" "}
                  encontrado{events.length !== 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((e) => {
                  const status = getEventStatus(e.startDate, e.endDate);
                  return (
                    <Card
                      key={e.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <Link href={`/events/${e.slug}`} className="block">
                        <div className="relative w-full h-48 overflow-hidden">
                          {(e as any).heroImageUrl &&
                          isValidImageUrl((e as any).heroImageUrl) ? (
                            <Image
                              src={(e as any).heroImageUrl}
                              alt={e.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <Calendar className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant={
                                status === "ongoing"
                                  ? "default"
                                  : status === "upcoming"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {status === "ongoing"
                                ? "En curso"
                                : status === "upcoming"
                                  ? "Próximo"
                                  : "Finalizado"}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {e.title}
                          </h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {e.locationCity ?? "-"},{" "}
                                {e.locationCountry ?? "-"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDate(e.startDate)}
                                {e.endDate &&
                                  e.endDate !== e.startDate &&
                                  ` - ${formatDate(e.endDate)}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <WhatsAppCTA
                          variant="outline"
                          size="sm"
                          label="Consultar por WhatsApp"
                          template="Hola! Me interesa el evento {title}."
                          variables={{ title: e.title }}
                          campaign="event_list"
                          content={e.slug}
                          className="w-full"
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
