import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowLeft, Heart, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface WeddingDestinationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WeddingDestinationPage({
  params,
}: WeddingDestinationPageProps) {
  const { slug } = await params;

  const destination = await prisma.weddingDestination.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      title: true,
      summary: true,
      description: true,
      heroImageUrl: true,
      gallery: true,
      location: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!destination) {
    notFound();
  }

  const gallery = Array.isArray(destination.gallery)
    ? (destination.gallery as string[])
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 overflow-x-hidden">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />

        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] sm:min-h-[500px] overflow-hidden">
          {destination.heroImageUrl ? (
            <Image
              src={destination.heroImageUrl}
              alt={destination.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-[#eaa298]/20 to-[#eaa298]/10" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
              <div className="max-w-4xl">
                <Link href="/weddings">
                  <Button
                    variant="ghost"
                    className="mb-4 sm:mb-6 text-white hover:bg-white/20 text-sm sm:text-base"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Bodas
                  </Button>
                </Link>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  {destination.title}
                </h1>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 text-white/90 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-base sm:text-lg">
                      {destination.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    <span className="text-base sm:text-lg">
                      Boda de Ensueño
                    </span>
                  </div>
                </div>

                {destination.summary && (
                  <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
                    {destination.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  {destination.description && (
                    <div className="mb-8 sm:mb-12">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Sobre este destino
                      </h2>
                      <div className="prose prose-sm sm:prose-lg max-w-none">
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {destination.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Gallery */}
                  {gallery.length > 0 && (
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Galería de imágenes
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                        {gallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-[4/3] rounded-lg overflow-hidden w-full"
                          >
                            <Image
                              src={image}
                              alt={`${destination.title} - Imagen ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                  <div className="lg:sticky lg:top-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm w-full">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                        ¿Te interesa este destino?
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        Contáctanos para conocer más detalles sobre cómo podemos
                        hacer realidad tu boda perfecta en {destination.name}.
                      </p>

                      <WhatsAppCTA
                        template={`Hola! Me interesa conocer más sobre bodas en {destination}. ¿Podrían darme más información?`}
                        variables={{ destination: destination.name }}
                        label="Consultar Ahora"
                        className="w-full"
                      />
                    </div>

                    {/* Quick Info */}
                    <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-4 sm:p-6 w-full">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                        Información rápida
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <MapPin className="h-4 w-4 text-[#eaa298] flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-600">
                            {destination.location || destination.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Heart className="h-4 w-4 text-[#eaa298] flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-600">
                            Bodas de ensueño
                          </span>
                        </div>
                        {destination.isFeatured && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Star className="h-4 w-4 text-[#eaa298] flex-shrink-0" />
                            <span className="text-sm sm:text-base text-gray-600">
                              Destino destacado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-[#eaa298] to-[#eaa298]/80">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para planificar tu boda perfecta?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para hacer realidad tu boda
              de ensueño en {destination.name}.
            </p>
            <WhatsAppCTA
              template={`Hola! Quiero planificar mi boda en {destination}. ¿Podrían ayudarme?`}
              variables={{ destination: destination.name }}
              label="Comenzar Planificación"
              variant="secondary"
              size="lg"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
