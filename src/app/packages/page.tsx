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
import { Search, Package, Tag, MapPin, Filter, Star } from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Paquetes de Viaje
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Descubre nuestros paquetes personalizados y predefinidos para
                crear experiencias únicas
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
                    className="pl-10"
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar paquetes..."
                  />
                </div>
                <Select name="tagId" defaultValue={tagId || "all"}>
                  <SelectTrigger>
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
                <Select name="isCustom" defaultValue={isCustomParam || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de paquete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="false">Predefinidos</SelectItem>
                    <SelectItem value="true">Personalizados</SelectItem>
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

        {/* Packages Grid */}
        <section className="container mx-auto px-4 pb-16">
          {packages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  No se encontraron paquetes
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
                  {packages.length} paquete{packages.length !== 1 ? "s" : ""}{" "}
                  encontrado{packages.length !== 1 ? "s" : ""}
                </h2>
                {isCustom !== undefined && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Package className="h-3 w-3" />
                    {isCustom ? "Personalizados" : "Predefinidos"}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((p) => (
                  <Card
                    key={p.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/packages/${p.slug}`} className="block">
                      <div className="relative w-full h-48 overflow-hidden">
                        {p.heroImageUrl && isValidImageUrl(p.heroImageUrl) ? (
                          <Image
                            src={p.heroImageUrl}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant={p.isCustom ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {p.isCustom ? "Personalizado" : "Predefinido"}
                          </Badge>
                        </div>
                        {p.fromPrice && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-white/90 text-black hover:bg-white text-xs">
                              Desde ${p.fromPrice.toString()}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                          {p.title}
                        </h3>
                        {p.summary && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {p.summary}
                          </p>
                        )}

                        {/* Tags */}
                        {p.packageTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.packageTags.slice(0, 3).map((pt) => (
                              <Link
                                key={pt.tagId}
                                href={`/tags/${pt.tag.slug}`}
                                className="inline-block"
                              >
                                <Badge
                                  variant="outline"
                                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                >
                                  {pt.tag.name}
                                </Badge>
                              </Link>
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
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
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
                    </Link>
                    <div className="px-4 pb-4">
                      <WhatsAppCTA
                        variant="outline"
                        size="sm"
                        label="Consultar por WhatsApp"
                        template="Hola! Me interesa el paquete {title}."
                        variables={{ title: p.title }}
                        campaign="package_list"
                        content={p.slug}
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
