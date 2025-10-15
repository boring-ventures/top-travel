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
  Plane,
  ArrowRight,
  Compass,
} from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <AnimatedHero
            title="Descubre nuestras"
            subtitle="de viaje"
            description="Viajes programados con fechas fijas y precios especiales. Únete a nuestros grupos y vive experiencias únicas."
            animatedWords={[
              "Salidas Fijas",
              "Grupos",
              "Experiencias",
              "Aventuras",
              "Momentos",
            ]}
            backgroundImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
            animatedWordColor="text-wine"
            accentColor="bg-wine"
          />
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">
              Encuentra tu{" "}
              <span className="font-light italic text-wine">salida fija</span>{" "}
              ideal
            </h2>
            <form method="get">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end w-full">
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Destino
                  </label>
                  <Select
                    name="destinationId"
                    defaultValue={destinationId || "all"}
                  >
                    <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
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
                </div>
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Fecha Desde
                  </label>
                  <Input
                    name="from"
                    type="date"
                    className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                    defaultValue={from ?? ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold italic text-gray-700 mb-2">
                    Fecha Hasta
                  </label>
                  <Input
                    name="to"
                    type="date"
                    className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                    defaultValue={to ?? ""}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-wine text-white hover:bg-wine/90 transition-colors duration-200 font-medium rounded-xl"
                  >
                    Buscar Salidas »
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Fixed Departures Grid */}
        <section className="py-8 w-full bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-muted-foreground mb-6">
                  <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    No se encontraron salidas fijas
                  </h3>
                  <p className="text-lg max-w-md mx-auto text-muted-foreground">
                    Intenta ajustar tus filtros de búsqueda o consulta con
                    nosotros para salidas próximas
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button asChild variant="outline">
                      <Link href="/contact">Contactar</Link>
                    </Button>
                    <WhatsAppCTA
                      template="Hola! Quiero información sobre salidas fijas próximas."
                      variables={{}}
                      label="Consultar por WhatsApp"
                      phone="+59169671000"
                      size="default"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-left">
                      {items.length}{" "}
                      <span className="font-light italic text-wine">
                        salida{items.length !== 1 ? "s" : ""} fija
                        {items.length !== 1 ? "s" : ""}
                      </span>{" "}
                      encontrada{items.length !== 1 ? "s" : ""}
                    </h2>
                    <p className="text-gray-600">Resultados de tu búsqueda</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((f) => {
                    const status = getDepartureStatus(f.startDate);
                    return (
                      <div
                        key={f.id}
                        className="relative overflow-hidden rounded-lg group"
                      >
                        <Link
                          href={`/fixed-departures/${f.slug}`}
                          className="block"
                        >
                          <div className="relative h-64 sm:h-72">
                            {(f as any).heroImageUrl &&
                            isValidImageUrl((f as any).heroImageUrl) ? (
                              <Image
                                src={(f as any).heroImageUrl}
                                alt={f.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-wine/20 to-wine/10 flex items-center justify-center">
                                <Plane className="h-12 w-12 text-wine" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent p-6 flex flex-col justify-start">
                              <div className="flex justify-between items-start mb-4">
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
                                {f.destination && (
                                  <Badge className="bg-white/90 text-wine hover:bg-white text-xs">
                                    {f.destination.city}
                                  </Badge>
                                )}
                              </div>
                              <div>
                                <h2 className="text-white text-xl font-semibold uppercase">
                                  {f.title}
                                </h2>
                                <p className="text-white">
                                  {f.destination
                                    ? `${f.destination.city}, ${f.destination.country}`
                                    : "Bolivia"}
                                </p>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                              <div className="flex justify-between items-center">
                                <p className="text-white text-lg font-bold">
                                  {formatDate(f.startDate)} -{" "}
                                  {formatDate(f.endDate)}
                                </p>
                                <div className="text-white">
                                  <ArrowRight className="h-5 w-5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
