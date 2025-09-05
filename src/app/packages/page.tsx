import prisma from "@/lib/prisma";
import { filterValidImageUrls } from "@/lib/utils";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import TabbedContent from "@/components/views/landing-page/TabbedContent";
import { AnimatedHero } from "@/components/ui/animated-hero";
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
  Filter,
  MapPin,
  Compass,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { ShineBorder } from "@/components/magicui/shine-border";

// Fallback images for different categories
const FALLBACK_IMAGES = {
  packages:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
  custom:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  adventure:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
  luxury:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
};

interface PackagesPageProps {
  searchParams?: Promise<{
    q?: string;
    tagId?: string;
    destinationId?: string;
    isCustom?: string;
  }>;
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const params = await searchParams;
  const q = params?.q?.trim() || undefined;
  const tagId = params?.tagId || undefined;
  const destinationId = params?.destinationId || undefined;
  const isCustomParam = params?.isCustom;
  const isCustom = isCustomParam == null ? undefined : isCustomParam === "true";

  let packages: any[] = [];
  let customPackages: any[] = [];
  let adventurePackages: any[] = [];
  let luxuryPackages: any[] = [];
  let filteredPackages: any[] = [];
  let tags: any[] = [];
  let destinations: any[] = [];
  let whatsappTemplates: any = {};

  // Check if there are active filters
  const hasActiveFilters = q || (tagId && tagId !== "all") || (destinationId && destinationId !== "all") || (isCustomParam && isCustomParam !== "all");

  try {
    // Build where clause for filtered packages
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

    const results = await Promise.all([
      prisma.package.findMany({
        where: { status: "PUBLISHED", isCustom: false },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          heroImageUrl: true,
          fromPrice: true,
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
    prisma.package.findMany({
        where: { status: "PUBLISHED", isCustom: true },
      orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          heroImageUrl: true,
          fromPrice: true,
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
      prisma.package.findMany({
        where: {
          status: "PUBLISHED",
          packageTags: {
            some: {
              tag: {
                slug: "aventura",
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          heroImageUrl: true,
          fromPrice: true,
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
    prisma.package.findMany({
        where: {
          status: "PUBLISHED",
          packageTags: {
            some: {
              tag: {
                slug: "lujo",
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          heroImageUrl: true,
          fromPrice: true,
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
      // Filtered packages query
      hasActiveFilters ? prisma.package.findMany({
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
      }) : Promise.resolve([]),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.destination.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }],
    }),
  ]);
    [packages, customPackages, adventurePackages, luxuryPackages, filteredPackages, tags, destinations] = results as any;

    // Fetch WhatsApp templates for different usage types
    whatsappTemplates = {
      packages: await getWhatsAppTemplateByUsage("PACKAGES"),
      general: await getWhatsAppTemplateByUsage("GENERAL"),
    };
  } catch (err) {
    console.error("Packages data fetch failed", err);
  }

  // Helper function to get valid image URL
  const getValidImageUrl = (
    url: string | null | undefined,
    fallback: string
  ) => {
    if (!url || url === "1" || url === "null" || url === "undefined") {
      return fallback;
    }
    return url;
  };

  // Helper function to get destinations text
  const getDestinationsText = (packageDestinations: any[]) => {
    if (!packageDestinations.length) return "Bolivia";
    return packageDestinations
      .slice(0, 2)
      .map((pd) => pd.destination.city)
      .join(", ");
  };

  // Prepare tabbed content data - Show ALL items without limit
  const tabbedContent = [
    {
      id: "packages",
      label: "Paquetes Predefinidos",
      href: "/packages",
      items: packages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        description: pkg.summary || "Paquete de viaje predefinido",
        imageUrl: getValidImageUrl(pkg.heroImageUrl, FALLBACK_IMAGES.packages),
        href: `/packages/${pkg.slug}`,
        price: pkg.fromPrice ? `Desde $${pkg.fromPrice}` : "Consultar precio",
        location: getDestinationsText(pkg.packageDestinations),
      })),
    },
    {
      id: "custom",
      label: "Paquetes Personalizados",
      href: "/packages?isCustom=true",
      items: customPackages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        description: pkg.summary || "Paquete de viaje personalizado",
        imageUrl: getValidImageUrl(pkg.heroImageUrl, FALLBACK_IMAGES.custom),
        href: `/packages/${pkg.slug}`,
        price: pkg.fromPrice ? `Desde $${pkg.fromPrice}` : "Consultar precio",
        location: getDestinationsText(pkg.packageDestinations),
      })),
    },
    {
      id: "adventure",
      label: "Aventuras",
      href: "/packages",
      items: adventurePackages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        description: pkg.summary || "Paquete de aventura",
        imageUrl: getValidImageUrl(pkg.heroImageUrl, FALLBACK_IMAGES.adventure),
        href: `/packages/${pkg.slug}`,
        price: pkg.fromPrice ? `Desde $${pkg.fromPrice}` : "Consultar precio",
        location: getDestinationsText(pkg.packageDestinations),
      })),
    },
    {
      id: "luxury",
      label: "Lujo",
      href: "/packages",
      items: luxuryPackages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        description: pkg.summary || "Paquete de lujo",
        imageUrl: getValidImageUrl(pkg.heroImageUrl, FALLBACK_IMAGES.luxury),
        href: `/packages/${pkg.slug}`,
        price: pkg.fromPrice ? `Desde $${pkg.fromPrice}` : "Consultar precio",
        location: getDestinationsText(pkg.packageDestinations),
      })),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

                {/* Hero Section */}
        <section className="relative">
          <AnimatedHero
            title="Descubre nuestros"
            subtitle="de viaje"
            description="Paquetes predefinidos y personalizados para crear experiencias únicas que se adaptan a tus sueños de viaje."
            animatedWords={["Paquetes", "Aventuras", "Experiencias", "Sueños", "Momentos"]}
            backgroundImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
            animatedWordColor="text-wine"
            accentColor="bg-wine"
          />
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">
              Encuentra el mejor <span className="font-light italic">paquete</span> de viaje
            </h2>
            <form method="get">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end w-full">
                  <div>
                                         <label className="block text-sm font-bold italic text-gray-700 mb-2">
                       Búsqueda
                     </label>
                    <Input
                      className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl"
                      type="text"
                      name="q"
                      defaultValue={q}
                      placeholder="Buscar paquetes..."
                    />
                  </div>
                  <div>
                                         <label className="block text-sm font-bold italic text-gray-700 mb-2">
                       Destino
                     </label>
                    <Select name="destinationId" defaultValue={destinationId || "all"}>
                                            <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                        <SelectValue placeholder="Ciudad/Región/País" />
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
                       Tipo de Paquete
                     </label>
                  <Select name="isCustom" defaultValue={isCustomParam || "all"}>
                                                                                                                                                                                <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                        <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="false">Predefinidos</SelectItem>
                      <SelectItem value="true">Personalizados</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  <div>
                                         <label className="block text-sm font-bold italic text-gray-700 mb-2">
                       Categoría
                     </label>
                    <Select name="tagId" defaultValue={tagId || "all"}>
                      <SelectTrigger className="h-12 bg-gray-50 border-0 focus:border-0 focus:ring-0 rounded-xl">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {tags.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                  <Button
                    type="submit"
                        className="h-12 w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium rounded-xl"
                  >
                        Buscar Paquetes »
                  </Button>
                  </div>
                </div>
              </form>
          </div>
        </section>

                 {/* Results Section */}
         {hasActiveFilters ? (
           <section className="py-8 w-full bg-white">
             <div className="w-full px-4 sm:px-6 lg:px-8">
              {filteredPackages.length === 0 ? (
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
                             <div className="flex items-center justify-between mb-6">
                <div>
                   <h2 className="text-3xl font-bold text-gray-900 mb-2 text-left">
                         {filteredPackages.length} <span className="font-light italic">paquete</span>{filteredPackages.length !== 1 ? "s" : ""}{" "}
                         encontrado{filteredPackages.length !== 1 ? "s" : ""}
                  </h2>
                   <p className="text-gray-600">
                         Resultados de tu búsqueda
                  </p>
                </div>
                                 {isCustom !== undefined && isCustom && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <Package className="h-4 w-4" />
                     Personalizados
                  </Badge>
                )}
              </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map((p) => (
                                     <div key={p.id} className="relative overflow-hidden rounded-lg group">
                     <Link href={`/packages/${p.slug}`} className="block">
                       <div className="relative h-64 sm:h-72">
                          <Image
                           src={p.heroImageUrl && p.heroImageUrl !== "1" && p.heroImageUrl !== "null" ? p.heroImageUrl : FALLBACK_IMAGES.packages}
                            alt={p.title}
                            fill
                           className="object-cover transition-transform duration-300 group-hover:scale-105"
                         />
                         <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent p-6 flex flex-col justify-start">
                           <div>
                             <h2 className="text-white text-xl font-semibold uppercase">
                               {p.title}
                             </h2>
                             <p className="text-white">{p.packageDestinations.length > 0 ? p.packageDestinations.slice(0, 2).map((pd: any) => pd.destination.city).join(", ") : "Bolivia"}</p>
                        </div>
                      </div>
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                           <div className="flex justify-between items-center">
                             <p className="text-white text-lg font-bold">
                               {p.fromPrice ? `Desde $${p.fromPrice}` : "Consultar precio"}
                             </p>
                             <div className="text-white">
                               <ArrowRight className="h-5 w-5" />
                            </div>
                            </div>
                        </div>
                      </div>
                    </Link>
                    </div>
                ))}
              </div>
            </>
          )}
            </div>
          </section>
        ) : (
          /* Tabbed Content Section */
          <section className="py-12 w-full bg-white">
            <div className="container mx-auto px-4">
              <TabbedContent tabs={tabbedContent} showViewAllButton={false} />
            </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

