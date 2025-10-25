import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Tag,
  Package,
  MapPin,
  ArrowLeft,
  Calendar,
  Star,
  Share2,
  Heart,
  Globe,
  Plane,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { pageMeta } from "@/lib/seo";
import { isValidImageUrl } from "@/lib/utils";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      packageTags: {
        include: {
          package: {
            include: {
              packageDestinations: {
                include: {
                  destination: true,
                },
              },
            },
          },
        },
      },
      destinationTags: {
        include: {
          destination: true,
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const packages = tag.packageTags
    .map((pt) => pt.package)
    .filter((pkg) => pkg.status === "PUBLISHED")
    .map((pkg) => ({
      ...pkg,
      fromPrice: pkg.fromPrice ? Number(pkg.fromPrice) : undefined,
    }));

  const destinations = tag.destinationTags.map((dt) => dt.destination);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "REGION":
        return "Región";
      case "THEME":
        return "Tema";
      case "DEPARTMENT":
        return "Departamento";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REGION":
        return "bg-blue-100 text-blue-800";
      case "THEME":
        return "bg-green-100 text-green-800";
      case "DEPARTMENT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "REGION":
        return <Globe className="h-4 w-4" />;
      case "THEME":
        return <Tag className="h-4 w-4" />;
      case "DEPARTMENT":
        return <Package className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Link href="/tags">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a etiquetas
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-full">
                  {getTypeIcon(tag.type)}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {tag.name}
                  </h1>
                  <Badge
                    className={`${getTypeColor(tag.type)} text-white border-white/30`}
                  >
                    {getTypeLabel(tag.type)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{packages.length}</div>
                  <div className="text-white/80">Paquetes</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {destinations.length}
                  </div>
                  <div className="text-white/80">Destinos</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {tag.packageTags.length + tag.destinationTags.length}
                  </div>
                  <div className="text-white/80">Total contenido</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 py-8">
          <div className="space-y-12">
            {/* Packages Section */}
            {packages.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Paquetes ({packages.length})
                  </h2>
                  <Button asChild variant="outline">
                    <Link href={`/packages?tagId=${tag.id}`}>
                      Ver todos los paquetes
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.slice(0, 6).map((pkg) => (
                    <Card
                      key={pkg.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <Link href={`/packages/${pkg.slug}`} className="block">
                        <div className="relative w-full h-48 overflow-hidden">
                          {pkg.heroImageUrl &&
                          isValidImageUrl(pkg.heroImageUrl) ? (
                            <Image
                              src={pkg.heroImageUrl}
                              alt={pkg.title}
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
                              variant={pkg.isCustom ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {pkg.isCustom ? "Personalizado" : "Predefinido"}
                            </Badge>
                          </div>
                          {pkg.fromPrice && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-white/90 text-black hover:bg-white text-xs">
                                Desde{" "}
                                {formatPriceWithCurrency(
                                  pkg.fromPrice,
                                  pkg.currency,
                                  false
                                )}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                            {pkg.title}
                          </h3>
                          {pkg.summary && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {pkg.summary}
                            </p>
                          )}

                          {/* Destinations */}
                          {pkg.packageDestinations.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>
                                {pkg.packageDestinations
                                  .slice(0, 2)
                                  .map((pd) => pd.destination.city)
                                  .join(", ")}
                                {pkg.packageDestinations.length > 2 &&
                                  ` +${pkg.packageDestinations.length - 2} más`}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <WhatsAppCTA
                          variant="outline"
                          size="sm"
                          label="Consultar"
                          template="Hola! Me interesa el paquete {title}."
                          variables={{ title: pkg.title }}
                          campaign="tag_detail"
                          content={`${tag.slug}_${pkg.slug}`}
                          className="w-full"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations Section */}
            {destinations.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Destinos ({destinations.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((destination) => (
                    <Card
                      key={destination.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <Link
                        href={`/destinations/${destination.slug}`}
                        className="block"
                      >
                        <div className="relative w-full h-48 overflow-hidden">
                          {destination.heroImageUrl &&
                          isValidImageUrl(destination.heroImageUrl) ? (
                            <Image
                              src={destination.heroImageUrl}
                              alt={`${destination.city}, ${destination.country}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <MapPin className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          {destination.isFeatured && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-yellow-500 text-white text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Destacado
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">
                            {destination.city}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {destination.country}
                          </p>
                          {destination.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {destination.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tags */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Explorar más</h2>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/tags">Ver todas las etiquetas</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/packages">Explorar paquetes</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/destinations">Explorar destinos</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/fixed-departures">Ver salidas fijas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });

  if (!tag) {
    return {
      title: "Etiqueta no encontrada",
    };
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "REGION":
        return "Región";
      case "THEME":
        return "Tema";
      case "DEPARTMENT":
        return "Departamento";
      default:
        return type;
    }
  };

  return pageMeta({
    title: `${tag.name} - ${getTypeLabel(tag.type)}`,
    description: `Explora contenido relacionado con ${tag.name}. Descubre paquetes, destinos y experiencias en esta ${getTypeLabel(tag.type).toLowerCase()}.`,
    urlPath: `/tags/${slug}`,
  });
}
