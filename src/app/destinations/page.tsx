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
import { Search, MapPin, Star, Filter } from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";

interface DestinationsPageProps {
  searchParams?: Promise<{
    country?: string;
    city?: string;
    featured?: string;
  }>;
}

export default async function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const params = await searchParams;
  const country = params?.country || undefined;
  const city = params?.city || undefined;
  const isFeatured = params?.featured === "true" ? true : undefined;

  const where: any = { 
    country: country === "all" ? undefined : country, 
    city, 
    isFeatured 
  };
  const destinations = await prisma.destination.findMany({
    where,
    orderBy: [{ country: "asc" }, { city: "asc" }],
  });

  // Get unique countries and cities for filters
  const allDestinations = await prisma.destination.findMany({
    select: { country: true, city: true },
    orderBy: [{ country: "asc" }, { city: "asc" }],
  });

  const countries = [...new Set(allDestinations.map((d) => d.country))].filter(
    Boolean
  );
  const cities = [...new Set(allDestinations.map((d) => d.city))].filter(
    Boolean
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Descubre Destinos Increíbles
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Explora los mejores destinos del mundo con nuestras experiencias
                únicas y personalizadas
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <form className="space-y-4" method="get">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    name="city"
                    placeholder="Buscar ciudad..."
                    className="pl-10"
                    defaultValue={city ?? ""}
                  />
                </div>
                <Select name="country" defaultValue={country || "all"}>
                  <SelectTrigger>
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
                <Select
                  name="featured"
                  defaultValue={isFeatured === true ? "true" : "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los destinos</SelectItem>
                    <SelectItem value="true">Destinos destacados</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Destinations Grid */}
        <section className="container mx-auto px-4 pb-16">
          {destinations.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  No se encontraron destinos
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
                  {destinations.length} destino
                  {destinations.length !== 1 ? "s" : ""} encontrado
                  {destinations.length !== 1 ? "s" : ""}
                </h2>
                {isFeatured && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Star className="h-3 w-3" />
                    Destinos destacados
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations.map((d) => (
                  <Card
                    key={d.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/destinations/${d.slug}`} className="block">
                      <div className="relative w-full h-48 overflow-hidden">
                        {d.heroImageUrl && isValidImageUrl(d.heroImageUrl) ? (
                          <Image
                            src={d.heroImageUrl}
                            alt={`${d.city}, ${d.country}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        {d.isFeatured && (
                          <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                          {d.city}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {d.country}
                        </p>
                        {d.displayTag && (
                          <Badge variant="outline" className="text-xs">
                            {d.displayTag}
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <WhatsAppCTA
                        variant="outline"
                        size="sm"
                        label="Consultar por WhatsApp"
                        template="Hola! Me interesa viajar a {city}, {country}."
                        variables={{ city: d.city, country: d.country }}
                        campaign="destination_list"
                        content={d.slug}
                        className="w-full"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
