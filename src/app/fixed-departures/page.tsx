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
import { Search, Calendar, MapPin, Clock, Filter, Plane } from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";

interface FDPageProps {
  searchParams?: Promise<{
    destinationId?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function FixedDeparturesPage({
  searchParams,
}: FDPageProps) {
  const params = await searchParams;
  const destinationId = params?.destinationId || undefined;
  const from = params?.from;
  const to = params?.to;

  const where: any = {
    status: "PUBLISHED",
    destinationId: destinationId === "all" ? undefined : destinationId,
    ...(from || to
      ? {
          AND: [
            from ? { endDate: { gte: new Date(from) } } : {},
            to ? { startDate: { lte: new Date(to) } } : {},
          ],
        }
      : {}),
  };

  const [items, destinations] = await Promise.all([
    prisma.fixedDeparture.findMany({
      where,
      orderBy: { startDate: "asc" },
      take: 50,
      include: {
        destination: true,
      },
    }),
    prisma.destination.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }],
    }),
  ]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getDepartureStatus = (startDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const daysUntil = Math.ceil(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil < 0) return "past";
    if (daysUntil <= 7) return "soon";
    if (daysUntil <= 30) return "upcoming";
    return "future";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Salidas Fijas
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Viajes programados con fechas fijas y precios especiales. Únete
                a nuestros grupos y vive experiencias únicas.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container mx-auto px-4 py-8">
          <Card className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-xl">
            <form className="space-y-4" method="get">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  name="destinationId"
                  defaultValue={destinationId || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los destinos</SelectItem>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.city}, {d.country}
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

        {/* Fixed Departures Grid */}
        <section className="container mx-auto px-4 pb-16">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Plane className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  No se encontraron salidas fijas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {items.length} salida{items.length !== 1 ? "s" : ""} fija
                  {items.length !== 1 ? "s" : ""} encontrada
                  {items.length !== 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((f) => {
                  const status = getDepartureStatus(f.startDate);
                  return (
                    <Card
                      key={f.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-0"
                    >
                      <Link
                        href={`/fixed-departures/${f.slug}`}
                        className="block"
                      >
                        <div className="relative w-full h-48 overflow-hidden">
                          {(f as any).heroImageUrl &&
                          isValidImageUrl((f as any).heroImageUrl) ? (
                            <Image
                              src={(f as any).heroImageUrl}
                              alt={f.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                              <Plane className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant={
                                status === "soon"
                                  ? "destructive"
                                  : status === "upcoming"
                                    ? "default"
                                    : status === "future"
                                      ? "secondary"
                                      : "outline"
                              }
                              className="text-xs"
                            >
                              {status === "soon"
                                ? "Pronto"
                                : status === "upcoming"
                                  ? "Próximo"
                                  : status === "future"
                                    ? "Futuro"
                                    : "Finalizado"}
                            </Badge>
                          </div>
                          {f.destination && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-card/90 text-card-foreground hover:bg-card text-xs">
                                {f.destination.city}
                              </Badge>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 text-foreground">
                            {f.title}
                          </h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDate(f.startDate)} -{" "}
                                {formatDate(f.endDate)}
                              </span>
                            </div>
                            {f.destination && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {f.destination.city}, {f.destination.country}
                                </span>
                              </div>
                            )}
                            {(f as any)?.amenities &&
                              (f as any).amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {(f as any).amenities
                                    .slice(0, 2)
                                    .map((amenity: string, index: number) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                                      >
                                        {amenity}
                                      </span>
                                    ))}
                                  {(f as any).amenities.length > 2 && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                      +{(f as any).amenities.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <WhatsAppCTA
                          variant="outline"
                          size="sm"
                          label="Consultar por WhatsApp"
                          template="Hola! Me interesa la salida fija {title}."
                          variables={{ title: f.title }}
                          campaign="fixed_departure_list"
                          content={f.slug}
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
