import prisma from "@/lib/prisma";
import Link from "next/link";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowLeft,
  Star,
  Share2,
  Package,
  DollarSign,
  Calendar,
  Clock,
  Check,
  X,
  Heart,
  Plane,
  Users,
  Globe,
  Shield,
  Wifi,
  Car,
  Utensils,
  Bed,
  Camera,
  Coffee,
  Sun,
  Moon,
  Compass,
  Award,
  Info,
  Phone,
  Mail,
  Map,
  Navigation,
  Zap,
  Gift,
} from "lucide-react";
import { notFound } from "next/navigation";
import { PackagePdfSection } from "@/components/ui/package-pdf-section";

type Params = { params: Promise<{ slug: string }> };

export default async function PackageDetailPage({ params }: Params) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      packageDestinations: { include: { destination: true } },
      packageTags: { include: { tag: true } },
    },
  });

  if (!pkg || pkg.status !== "PUBLISHED") {
    notFound();
  }

  // Convert Decimal objects to numbers for client components
  const pkgWithNumbers = {
    ...pkg,
    fromPrice: pkg.fromPrice ? Number(pkg.fromPrice) : undefined,
    pdfUrl: pkg.pdfUrl,
  };

  const destinations = pkgWithNumbers.packageDestinations.map(
    (pd) => pd.destination
  );
  const tags = pkgWithNumbers.packageTags.map((pt) => pt.tag);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {pkgWithNumbers.heroImageUrl ? (
          <Image
            src={pkgWithNumbers.heroImageUrl}
            alt={pkgWithNumbers.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="backdrop-blur-sm bg-white/80 text-black hover:bg-white/90 border border-black/20"
          >
            <Link href="/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a paquetes
            </Link>
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30"
              >
                <Package className="h-3 w-3 mr-1" />
                {pkgWithNumbers.isCustom ? "Paquete Personalizado" : "Paquete"}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
              {pkgWithNumbers.title}
            </h1>

            {pkgWithNumbers.summary && (
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mb-6 drop-shadow-lg">
                {pkgWithNumbers.summary}
              </p>
            )}

            {/* Price and Destinations */}
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              {pkgWithNumbers.fromPrice && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                  <DollarSign className="h-4 w-4 text-white" />
                  <span className="font-semibold text-white">
                    Desde {pkgWithNumbers.currency ?? "USD"}{" "}
                    {pkgWithNumbers.fromPrice.toString()}
                  </span>
                </div>
              )}
              {destinations.length > 0 && (
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {destinations
                      .slice(0, 2)
                      .map((d) => d.city)
                      .join(", ")}
                    {destinations.length > 2 &&
                      ` +${destinations.length - 2} más`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Information Card */}
            <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-black/80">
                  <DollarSign className="h-5 w-5 text-black/60" />
                  Información de precios
                </h3>
                <div className="bg-black/5 p-4 rounded-lg border border-black/10">
                  {pkgWithNumbers.isCustom ? (
                    <div className="flex items-center gap-3">
                      <Gift className="h-6 w-6 text-black/60" />
                      <p className="text-lg text-black/80">
                        Paquete personalizado - Consulta precios
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-black/60" />
                          <span className="text-black/60">Precio desde:</span>
                        </div>
                        <span className="text-2xl font-bold text-black/90">
                          {pkgWithNumbers.currency ?? "USD"}{" "}
                          {pkgWithNumbers.fromPrice?.toString() ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-black/50 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-black/60">
                          * Los precios pueden variar según la temporada y
                          disponibilidad
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Inclusions */}
            {Array.isArray(pkgWithNumbers.inclusions) &&
              pkgWithNumbers.inclusions.length > 0 && (
                <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black/80">
                    <Check className="h-5 w-5 text-black/60" />
                    Incluye
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkgWithNumbers.inclusions.map((inc, idx) => {
                      // Función para obtener el icono apropiado basado en el contenido
                      const getInclusionIcon = (text: string) => {
                        const lowerText = text.toLowerCase();
                        if (
                          lowerText.includes("hotel") ||
                          lowerText.includes("alojamiento")
                        )
                          return <Bed className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("comida") ||
                          lowerText.includes("desayuno") ||
                          lowerText.includes("cena")
                        )
                          return <Utensils className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("transporte") ||
                          lowerText.includes("vuelo") ||
                          lowerText.includes("bus")
                        )
                          return <Car className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("wifi") ||
                          lowerText.includes("internet")
                        )
                          return <Wifi className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("guía") ||
                          lowerText.includes("tour")
                        )
                          return <Compass className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("seguro") ||
                          lowerText.includes("protección")
                        )
                          return <Shield className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("foto") ||
                          lowerText.includes("cámara")
                        )
                          return <Camera className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("café") ||
                          lowerText.includes("bebida")
                        )
                          return <Coffee className="h-4 w-4 text-black/60" />;
                        return <Check className="h-4 w-4 text-black/60" />;
                      };

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-black/5 rounded-lg border border-black/10 hover:bg-black/10 transition-colors"
                        >
                          {getInclusionIcon(inc)}
                          <span className="text-sm text-black/80">{inc}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

            {/* Exclusions */}
            {Array.isArray(pkgWithNumbers.exclusions) &&
              pkgWithNumbers.exclusions.length > 0 && (
                <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black/80">
                    <X className="h-5 w-5 text-black/60" />
                    No incluye
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkgWithNumbers.exclusions.map((exc, idx) => {
                      // Función para obtener el icono apropiado basado en el contenido
                      const getExclusionIcon = (text: string) => {
                        const lowerText = text.toLowerCase();
                        if (
                          lowerText.includes("hotel") ||
                          lowerText.includes("alojamiento")
                        )
                          return <Bed className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("comida") ||
                          lowerText.includes("desayuno") ||
                          lowerText.includes("cena")
                        )
                          return <Utensils className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("transporte") ||
                          lowerText.includes("vuelo") ||
                          lowerText.includes("bus")
                        )
                          return <Car className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("wifi") ||
                          lowerText.includes("internet")
                        )
                          return <Wifi className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("guía") ||
                          lowerText.includes("tour")
                        )
                          return <Compass className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("seguro") ||
                          lowerText.includes("protección")
                        )
                          return <Shield className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("foto") ||
                          lowerText.includes("cámara")
                        )
                          return <Camera className="h-4 w-4 text-black/60" />;
                        if (
                          lowerText.includes("café") ||
                          lowerText.includes("bebida")
                        )
                          return <Coffee className="h-4 w-4 text-black/60" />;
                        return <X className="h-4 w-4 text-black/60" />;
                      };

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-black/5 rounded-lg border border-black/10 hover:bg-black/10 transition-colors"
                        >
                          {getExclusionIcon(exc)}
                          <span className="text-sm text-black/80">{exc}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

            {/* Itinerary */}
            {pkg.itineraryJson && (
              <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-black/80">
                  Itinerario
                </h3>
                <div className="bg-black/5 p-4 rounded-lg border border-black/10">
                  <pre className="whitespace-pre-wrap text-sm text-black/80">
                    {JSON.stringify(pkg.itineraryJson, null, 2)}
                  </pre>
                </div>
              </Card>
            )}

            {/* PDF Document */}
            {pkgWithNumbers.pdfUrl && (
              <PackagePdfSection
                pdfUrl={pkgWithNumbers.pdfUrl}
                packageTitle={pkgWithNumbers.title}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-black/80">
                      ¿Te interesa este paquete?
                    </h3>
                    <p className="text-sm text-black/60">
                      Consulta disponibilidad, precios y reserva
                    </p>
                  </div>

                  <WhatsAppCTA
                    label="Consultar por WhatsApp"
                    template="Hola! Me interesa el paquete {title}."
                    variables={{ title: pkg.title, slug: pkg.slug }}
                    campaign="package_detail"
                    content={pkg.slug}
                    size="lg"
                    className="w-full"
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-black/20 hover:bg-black/5"
                    >
                      <Heart className="h-4 w-4 mr-2 text-black/60" />
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-black/20 hover:bg-black/5"
                    >
                      <Share2 className="h-4 w-4 mr-2 text-black/60" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
                <h4 className="font-semibold mb-4 text-black/80">
                  Información rápida
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-black/60" />
                      <span className="text-black/60">Tipo:</span>
                    </div>
                    <span className="font-medium text-black/80">
                      {pkgWithNumbers.isCustom
                        ? "Personalizado"
                        : "Predefinido"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-black/60" />
                      <span className="text-black/60">Destinos:</span>
                    </div>
                    <span className="font-medium text-black/80">
                      {destinations.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-black/60" />
                      <span className="text-black/60">Etiquetas:</span>
                    </div>
                    <span className="font-medium text-black/80">
                      {tags.length}
                    </span>
                  </div>
                  {pkgWithNumbers.fromPrice && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-black/60" />
                        <span className="text-black/60">Precio desde:</span>
                      </div>
                      <span className="font-semibold text-black/90">
                        {pkgWithNumbers.currency ?? "USD"}{" "}
                        {pkgWithNumbers.fromPrice.toString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Destinations Card */}
              {destinations.length > 0 && (
                <Card className="p-6 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-black/80">
                    <Globe className="h-4 w-4 text-black/60" />
                    Destinos incluidos
                  </h4>
                  <div className="space-y-3">
                    {destinations.slice(0, 3).map((destination) => (
                      <div
                        key={destination.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
                      >
                        <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-black/60" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-black/80">
                            {destination.city}
                          </div>
                          <div className="text-xs text-black/60">
                            {destination.country}
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-black/60 hover:text-black/80 hover:bg-black/5"
                        >
                          <Link href={`/destinations/${destination.slug}`}>
                            Ver
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {destinations.length > 3 && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full border-black/20 hover:bg-black/5"
                      >
                        <Link href="/destinations">Ver todos los destinos</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  const title = pkg?.title ? `${pkg.title}` : "Package";
  const description = pkg?.summary ?? undefined;
  const image = pkg?.heroImageUrl ?? undefined;
  return pageMeta({
    title,
    description,
    urlPath: `/packages/${slug}`,
    image,
  });
}
