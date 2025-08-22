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
  MapPin,
  Star,
  Filter,
  Globe,
  Compass,
  Sparkles,
} from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { ShineBorder } from "@/components/magicui/shine-border";

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
    isFeatured,
  };
  const destinations = await prisma.destination.findMany({
    where,
    orderBy: [{ country: "asc" }, { city: "asc" }],
    include: {
      destinationTags: {
        include: {
          tag: true,
        },
      },
    },
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Descubre Destinos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Increíbles
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Explora los mejores destinos del mundo con nuestras experiencias
                únicas y personalizadas. Desde playas paradisíacas hasta
                montañas imponentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Más de 50 destinos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Experiencias únicas
                  </span>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Select
                    name="featured"
                    defaultValue={isFeatured === true ? "true" : "all"}
                  >
                    <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-200">
                      <SelectValue placeholder="Tipo de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los destinos</SelectItem>
                      <SelectItem value="true">Destinos destacados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </form>
            </Card>
          </ShineBorder>
        </section>

        {/* Destinations Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {destinations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground mb-6">
                <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  No se encontraron destinos
                </h3>
                <p className="text-lg max-w-md mx-auto text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda o explora nuestros
                  destinos destacados
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link href="/destinations?featured=true">
                    Ver destinos destacados
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                    {destinations.length} destino
                    {destinations.length !== 1 ? "s" : ""} encontrado
                    {destinations.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-muted-foreground">
                    Explora nuestros destinos cuidadosamente seleccionados
                  </p>
                </div>
                {isFeatured && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <Star className="h-4 w-4" />
                    Destinos destacados
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {destinations.map((d) => (
                  <Card
                    key={d.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm flex flex-col"
                  >
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="block flex-1"
                    >
                      <div className="relative w-full h-56 overflow-hidden">
                        {d.heroImageUrl && isValidImageUrl(d.heroImageUrl) ? (
                          <Image
                            src={d.heroImageUrl}
                            alt={`${d.city}, ${d.country}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                            <MapPin className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        {d.isFeatured && (
                          <Badge className="absolute top-4 right-4 bg-card/95 text-card-foreground hover:bg-card shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">
                            Haz clic para explorar
                          </p>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors text-foreground">
                          {d.city}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {d.country}
                        </p>
                        {/* Tags */}
                        <div className="flex-1">
                          {d.destinationTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {d.destinationTags.slice(0, 3).map((dt) => (
                                <Badge
                                  key={dt.tagId}
                                  variant="outline"
                                  className="text-xs border-primary/20"
                                >
                                  {dt.tag.name}
                                </Badge>
                              ))}
                              {d.destinationTags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{d.destinationTags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="px-5 pb-5 mt-auto">
                      <WhatsAppCTA
                        variant="outline"
                        size="sm"
                        label="Consultar por WhatsApp"
                        template="Hola! Me interesa viajar a {city}, {country}."
                        variables={{ city: d.city, country: d.country }}
                        campaign="destination_list"
                        content={d.slug}
                        className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
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
