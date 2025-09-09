import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowLeft,
  Star,
  Share2,
  Heart,
  Camera,
  Users,
  Calendar,
  Clock,
  Award,
  Coffee,
  Utensils,
  Car,
  Wifi,
  Shield,
  Compass,
  Navigation,
  Info,
  Phone,
  Mail,
  Zap,
  Gift,
  Sun,
  Moon,
  Bed,
} from "lucide-react";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

export default async function WeddingDestinationDetailPage({ params }: Params) {
  const { slug } = await params;
  const destination = await prisma.weddingDestination.findUnique({
    where: { slug },
  });

  if (!destination) {
    notFound();
  }

  const relatedPackages = await prisma.package.findMany({
    where: {
      status: "PUBLISHED",
      isCustom: false,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      heroImageUrl: true,
      fromPrice: true,
      currency: true,
      durationDays: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          {destination.heroImageUrl ? (
            <Image
              src={destination.heroImageUrl}
              alt={destination.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-yellow-100 to-gold/20 flex items-center justify-center">
              <Heart className="h-24 w-24 text-gold/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Destino para Bodas
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {destination.title}
                </h1>
                {destination.description && (
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                    {destination.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-4 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild>
                <Link href="/weddings" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a Bodas
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Sobre {destination.name}
                    </h2>
                    {destination.description && (
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {destination.description}
                      </p>
                    )}
                  </div>

                  {/* Gallery */}
                  {destination.gallery &&
                    Array.isArray(destination.gallery) &&
                    destination.gallery.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                          Galería de Imágenes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {destination.gallery.map(
                            (image: any, index: number) => (
                              <div
                                key={index}
                                className="relative h-48 rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={image.url || image}
                                  alt={`${destination.name} - Imagen ${index + 1}`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Wedding Features */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Características para Bodas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg">
                          <Heart className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Ceremonia Romántica
                          </h4>
                          <p className="text-sm text-gray-600">
                            Lugares únicos para intercambiar votos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg">
                          <Camera className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Fotografía Profesional
                          </h4>
                          <p className="text-sm text-gray-600">
                            Escenarios perfectos para fotos inolvidables
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg">
                          <Users className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Capacidad Flexible
                          </h4>
                          <p className="text-sm text-gray-600">
                            Desde bodas íntimas hasta grandes celebraciones
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg">
                          <Award className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Servicio Premium
                          </h4>
                          <p className="text-sm text-gray-600">
                            Atención personalizada y de alta calidad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact CTA */}
                  <div className="bg-gradient-to-br from-gold/5 to-gold/10 p-6 rounded-lg border border-gold/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      ¿Interesado en {destination.name}?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Contáctanos para una consulta personalizada y cotización
                      gratuita.
                    </p>
                    <Button className="w-full bg-gold text-white hover:bg-gold-light">
                      <Phone className="h-4 w-4 mr-2" />
                      Consultar Ahora
                    </Button>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Información Rápida
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {destination.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Destino para Bodas
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Experiencia Premium
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Paquetes Relacionados
                </h2>
                <p className="text-lg text-gray-600">
                  Descubre nuestros paquetes especiales para bodas
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {pkg.heroImageUrl && (
                      <div className="relative h-48">
                        <Image
                          src={pkg.heroImageUrl}
                          alt={pkg.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pkg.title}
                      </h3>
                      {pkg.summary && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {pkg.summary}
                        </p>
                      )}
                      {pkg.fromPrice && (
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-gold">
                            {pkg.currency === "USD" ? "$" : "Bs"}{" "}
                            {pkg.fromPrice.toLocaleString()}
                          </span>
                          {pkg.durationDays && (
                            <span className="text-sm text-gray-500">
                              {pkg.durationDays} días
                            </span>
                          )}
                        </div>
                      )}
                      <Button asChild className="w-full">
                        <Link href={`/packages/${pkg.slug}`}>Ver Detalles</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
