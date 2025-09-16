import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  Camera,
  Gift,
  Star,
  Check,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { DepartmentType } from "@prisma/client";

export default async function WeddingsPage() {
  const [dept, weddingDestinations, weddingBlogPosts, testimonials] =
    await Promise.all([
      prisma.department.findUnique({ where: { type: "WEDDINGS" } }),
      prisma.weddingDestination.findMany({
        where: { isFeatured: true },
        take: 6,
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          description: true,
          heroImageUrl: true,
        },
      }),
      prisma.blogPost.findMany({
        where: {
          type: "WEDDINGS",
          status: "PUBLISHED",
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          heroImageUrl: true,
          author: true,
          publishedAt: true,
        },
      }),
      prisma.testimonial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          authorName: true,
          location: true,
          rating: true,
          content: true,
        },
      }),
    ]);

  const primary = (dept?.themeJson as any)?.primaryColor ?? "#eaa298";
  const accent = (dept?.themeJson as any)?.accentColor ?? "#fcf8fa";

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
            subtitle="de destino"
            description="Paquetes exclusivos de bodas que ofrecen experiencias inolvidables en los destinos más románticos del mundo."
            animatedWords={[
              "Bodas",
              "Soñadas",
              "Románticas",
              "Únicas",
              "Perfectas",
            ]}
            backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
            animatedWordColor="text-[#eaa298]"
            accentColor="bg-[#eaa298]"
          />
        </section>

        {/* Wedding Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestros{" "}
                <span className="font-light italic text-[#eaa298]">
                  Servicios
                </span>{" "}
                de Boda
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Ofrecemos una experiencia completa para hacer de tu boda el día
                más especial de tu vida
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Destinos Exclusivos
                </h3>
                <p className="text-gray-600 mb-4">
                  Lugares únicos y románticos para celebrar tu boda en el
                  destino perfecto
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Playas paradisíacas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Castillos históricos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Hoteles de lujo
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Planificación Completa
                </h3>
                <p className="text-gray-600 mb-4">
                  Nos encargamos de todos los detalles para que solo te
                  preocupes por disfrutar
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Coordinación de eventos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Gestión de proveedores
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Timeline detallado
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Experiencias Personalizadas
                </h3>
                <p className="text-gray-600 mb-4">
                  Cada boda es única y la adaptamos a tus gustos y preferencias
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Bodas íntimas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Celebraciones grandes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#eaa298]" />
                    Temáticas especiales
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Destinos para{" "}
                <span className="font-light italic text-[#eaa298]">Bodas</span>{" "}
                de Ensueño
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre algunos de nuestros destinos más populares para bodas
                románticas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {weddingDestinations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-[#eaa298]" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Destinos próximamente
                    </h3>
                    <p className="text-gray-600">
                      Estamos preparando destinos especiales para bodas.
                      Contáctanos para conocer nuestras opciones disponibles.
                    </p>
                  </div>
                </div>
              ) : (
                weddingDestinations.map((dest) => (
                  <Card
                    key={dest.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      {dest.heroImageUrl ? (
                        <Image
                          src={dest.heroImageUrl}
                          alt={dest.title || dest.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-[#eaa298]/20 to-[#eaa298]/10 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-[#eaa298]" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {dest.title || dest.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {dest.description ||
                          "Destino perfecto para tu boda de ensueño"}
                      </p>
                      <Link href={`/wedding-destinations/${dest.slug}`}>
                        <Button
                          variant="outline"
                          className="w-full border-[#eaa298] text-[#eaa298] hover:bg-[#eaa298] hover:text-white transition-colors duration-200"
                        >
                          Ver Detalles
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Consejos y{" "}
                <span className="font-light italic text-[#eaa298]">
                  Inspiración
                </span>{" "}
                para Bodas
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Descubre tips, tendencias y experiencias reales para hacer de tu
                boda un día perfecto
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {weddingBlogPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-[#eaa298]" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Artículos próximamente
                    </h3>
                    <p className="text-gray-600">
                      Estamos preparando contenido especial sobre bodas con
                      tips, tendencias y experiencias reales
                    </p>
                  </div>
                </div>
              ) : (
                weddingBlogPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      {post.heroImageUrl ? (
                        <Image
                          src={post.heroImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-[#eaa298]/20 to-[#eaa298]/10 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-[#eaa298]" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-[#eaa298] mb-2">
                        {post.publishedAt?.toLocaleDateString() ||
                          "Fecha no disponible"}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || "Artículo sobre bodas y planificación"}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button
                          variant="outline"
                          className="w-full border-[#eaa298] text-[#eaa298] hover:bg-[#eaa298] hover:text-white transition-colors duration-200"
                        >
                          Leer Más
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Testimonios de{" "}
                <span className="font-light italic text-[#eaa298]">
                  Parejas
                </span>{" "}
                Felices
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Lo que dicen nuestras parejas sobre su experiencia con nosotros
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <Star className="h-12 w-12 mx-auto mb-4 text-[#eaa298]" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Testimonios próximamente
                    </h3>
                    <p className="text-gray-600">
                      Pronto compartiremos las experiencias de nuestras parejas
                      felices
                    </p>
                  </div>
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({
                        length: Math.max(
                          0,
                          Math.min(5, testimonial.rating ?? 5)
                        ),
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-[#eaa298]"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="text-sm text-gray-600">
                      <div className="font-semibold">
                        {testimonial.authorName}
                      </div>
                      {testimonial.location && (
                        <div>{testimonial.location}</div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir{" "}
                <span className="font-light italic text-[#eaa298]">
                  Gaby Top Travel
                </span>{" "}
                para tu boda?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Experiencia
                </h3>
                <p className="text-gray-600 text-sm">
                  Más de 10 años creando bodas inolvidables
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Camera className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Atención al Detalle
                </h3>
                <p className="text-gray-600 text-sm">
                  Cada detalle cuenta para tu día perfecto
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Gift className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Servicio Personalizado
                </h3>
                <p className="text-gray-600 text-sm">
                  Adaptamos todo a tus gustos y presupuesto
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Calidad Garantizada
                </h3>
                <p className="text-gray-600 text-sm">
                  Trabajamos solo con los mejores proveedores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-16 w-16 text-[#eaa298]" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Listo para Planificar tu{" "}
                <span className="font-light italic text-[#eaa298]">Boda</span>{" "}
                de Ensueño?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Contáctanos hoy para una consulta gratuita y déjanos ayudarte a
                crear la boda de tus sueños. Te acompañamos en cada paso del
                camino.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola, quiero una consulta gratuita para mi boda — {url}"
                  variables={{ url: "" }}
                  label="Consulta Gratuita"
                  size="lg"
                  className="h-14 px-8 bg-[#eaa298] hover:bg-[#d49186] text-white border-0 text-lg font-semibold rounded-xl"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-2 border-[#eaa298] text-[#eaa298] hover:bg-[#eaa298] hover:text-white rounded-xl"
                >
                  <Link href="/contact">Más Información</Link>
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
