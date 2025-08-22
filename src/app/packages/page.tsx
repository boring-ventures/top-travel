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
  Package,
  Tag,
  MapPin,
  Filter,
  Star,
  Sparkles,
  Compass,
  Globe,
} from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { ShineBorder } from "@/components/magicui/shine-border";

interface PackagesPageProps {
  searchParams?: Promise<{
    q?: string;
    tagId?: string;
    destinationId?: string;
    isCustom?: string;
    page?: string;
  }>;
}

export default async function PackagesPage({
  searchParams,
}: PackagesPageProps) {
  const params = await searchParams;
  const q = params?.q?.trim() || undefined;
  const tagId = params?.tagId || undefined;
  const destinationId = params?.destinationId || undefined;
  const isCustomParam = params?.isCustom;
  const isCustom = isCustomParam == null ? undefined : isCustomParam === "true";

  const where: any = {
    status: "PUBLISHED",
    isCustom: isCustomParam === "all" ? undefined : isCustom,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(destinationId && destinationId !== "all"
      ? { packageDestinations: { some: { destinationId } } }
      : {}),
    ...(tagId && tagId !== "all" ? { packageTags: { some: { tagId } } } : {}),
  };

  const [packages, tags, destinations] = await Promise.all([
    prisma.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        packageTags: {
          include: {
            tag: true,
          },
        },
        packageDestinations: {
          include: {
            destination: true,
          },
        },
      },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.destination.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }],
    }),
  ]);

  // Convert Decimal objects to numbers for client components
  const packagesWithNumbers = packages.map((pkg) => ({
    ...pkg,
    fromPrice: pkg.fromPrice ? Number(pkg.fromPrice) : undefined,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-emerald-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Paquetes de Viaje
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Personalizados
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Descubre nuestros paquetes personalizados y predefinidos para
                crear experiencias únicas que se adaptan a tus sueños de viaje.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Paquetes personalizados
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                    <Input
                      className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200"
                      type="text"
                      name="q"
                      defaultValue={q}
                      placeholder="Buscar paquetes..."
                    />
                  </div>
                  <Select name="tagId" defaultValue={tagId || "all"}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-200">
                      <SelectValue placeholder="Seleccionar etiqueta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las etiquetas</SelectItem>
                      {tags.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    name="destinationId"
                    defaultValue={destinationId || "all"}
                  >
                    <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-200">
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
                  <Select name="isCustom" defaultValue={isCustomParam || "all"}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary transition-all duration-200">
                      <SelectValue placeholder="Tipo de paquete" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="false">Predefinidos</SelectItem>
                      <SelectItem value="true">Personalizados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    className="h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </form>
            </Card>
          </ShineBorder>
        </section>

        {/* Packages Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {packages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground mb-6">
                <Compass className="h-20 w-20 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  No se encontraron paquetes
                </h3>
                <p className="text-lg max-w-md mx-auto text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda o consulta con
                  nosotros para crear un paquete personalizado
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/contact">Contactar</Link>
                  </Button>
                  <WhatsAppCTA
                    template="Hola! Quiero crear un paquete personalizado."
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
                    {packages.length} paquete{packages.length !== 1 ? "s" : ""}{" "}
                    encontrado{packages.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-muted-foreground">
                    Explora nuestros paquetes cuidadosamente diseñados
                  </p>
                </div>
                {isCustom !== undefined && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <Package className="h-4 w-4" />
                    {isCustom ? "Personalizados" : "Predefinidos"}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {packagesWithNumbers.map((p) => (
                  <Card
                    key={p.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm flex flex-col"
                  >
                    <Link href={`/packages/${p.slug}`} className="block flex-1">
                      <div className="relative w-full h-56 overflow-hidden">
                        {p.heroImageUrl && isValidImageUrl(p.heroImageUrl) ? (
                          <Image
                            src={p.heroImageUrl}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 flex items-center justify-center">
                            <Package className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant={p.isCustom ? "default" : "secondary"}
                            className="text-xs shadow-lg"
                          >
                            {p.isCustom ? "Personalizado" : "Predefinido"}
                          </Badge>
                        </div>
                        {p.fromPrice && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-card/95 text-card-foreground hover:bg-card text-xs shadow-lg font-bold">
                              Desde ${p.fromPrice.toString()}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">
                            Haz clic para explorar
                          </p>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl mb-3 group-hover:text-green-600 transition-colors line-clamp-2 text-foreground">
                          {p.title}
                        </h3>
                        {p.summary && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {p.summary}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex-1">
                          {p.packageTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {p.packageTags.slice(0, 3).map((pt) => (
                                <Badge
                                  key={pt.tagId}
                                  variant="outline"
                                  className="text-xs border-primary/20"
                                >
                                  {pt.tag.name}
                                </Badge>
                              ))}
                              {p.packageTags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{p.packageTags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Destinations */}
                          {p.packageDestinations.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <MapPin className="h-3 w-3" />
                              <span>
                                {p.packageDestinations
                                  .slice(0, 2)
                                  .map((pd) => pd.destination.city)
                                  .join(", ")}
                                {p.packageDestinations.length > 2 &&
                                  ` +${p.packageDestinations.length - 2} más`}
                              </span>
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
                        template="Hola! Me interesa el paquete {title}."
                        variables={{ title: p.title }}
                        campaign="package_list"
                        content={p.slug}
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
