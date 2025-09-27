import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import PinkWhatsAppCTA from "@/components/utils/pink-whatsapp-cta";
import { GridMotion } from "@/components/ui/grid-motion";
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
  const [
    dept,
    weddingDestinations,
    weddingBlogPosts,
    testimonials,
    weddingTemplates,
  ] = await Promise.all([
    prisma.department.findUnique({ where: { type: "WEDDINGS" } }),
    prisma.weddingDestination.findMany({
      where: { isFeatured: true },
      take: 6,
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
    prisma.whatsAppTemplate.findMany({
      where: { usageType: "WEDDINGS" as any },
      select: {
        id: true,
        name: true,
        templateBody: true,
        phoneNumber: true,
        phoneNumbers: true,
        isDefault: true,
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
            title="Tu boda de ensueño"
            subtitle="en el destino perfecto"
            description="Transforma tu día especial en una experiencia única que combina romance, aventura y momentos inolvidables. Nosotros nos encargamos de todos los detalles para que tú solo te preocupes por disfrutar."
            animatedWords={[
              "Romántica",
              "Mágica",
              "Perfecta",
              "Inolvidable",
              "Soñada",
            ]}
            backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
            animatedWordColor="text-[#eaa298]"
            accentColor="bg-[#eaa298]"
          />
        </section>

        {/* Dream Wedding Hotels */}
        <section className="py-16 bg-gradient-to-br from-[#eaa298]/5 to-[#eaa298]/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Venues de ensueño para{" "}
                <span className="font-light italic text-[#eaa298]">
                  tu boda perfecta
                </span>
              </h2>
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                <p>
                  Trabajamos con los mejores venues del mundo para crear el
                  escenario perfecto para tu celebración. Cada lugar ha sido
                  cuidadosamente seleccionado por su belleza, exclusividad y
                  capacidad para crear momentos mágicos.
                </p>
                <p>
                  Desde playas de arena blanca hasta castillos históricos, desde
                  jardines tropicales hasta terrazas con vistas espectaculares,
                  cada venue cuenta una historia única que se convertirá en
                  parte de la tuya.
                </p>
                <p>
                  Nuestro equipo de expertos conoce cada detalle de estos
                  lugares especiales y se encarga de coordinar todos los
                  aspectos para que tu boda sea exactamente como la has soñado.
                  Tu única preocupación será disfrutar cada momento de esta
                  experiencia extraordinaria.
                </p>
              </div>
            </div>
          </div>
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

        {/* What are Destination Weddings */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Qué son las{" "}
                <span className="font-light italic text-[#eaa298]">
                  bodas de destino
                </span>
                ?
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
                <p>
                  Las bodas de destino son experiencias extraordinarias que
                  combinan la celebración de tu amor con la emoción de descubrir
                  nuevos lugares. Son ceremonias que se realizan en destinos
                  especiales, creando una experiencia única tanto para la pareja
                  como para sus invitados, transformando tu boda en unas
                  vacaciones inolvidables.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Escenarios naturales espectaculares
                </h3>
                <p className="text-gray-600">para una boda de ensueño</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Servicios personalizados
                </h3>
                <p className="text-gray-600">
                  para crear una celebración a tu medida
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Una experiencia completa
                </h3>
                <p className="text-gray-600">que combina romance y turismo</p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/wedding-destinations">
                <Button
                  size="lg"
                  className="bg-[#eaa298] hover:bg-[#d49186] text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Ver Destinos
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        {dest.title || dest.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
                        {dest.summary ||
                          dest.description ||
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

        {/* Wedding Gallery */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#eaa298]/10 text-[#eaa298] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Camera className="w-4 h-4" />
                Galería de bodas
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Bodas que hemos{" "}
                <span className="text-[#eaa298] relative">
                  hecho realidad
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#eaa298] to-[#eaa298]/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Cada imagen cuenta una historia de amor, cada detalle refleja
                nuestro compromiso con la perfección
              </p>
            </div>
          </div>

          <div className="h-screen w-full">
            <GridMotion
              items={[
                // Wedding gallery images from local folder - all 17 images
                "/images/weddings/1.webp",
                "/images/weddings/2.webp",
                "/images/weddings/3.webp",
                "/images/weddings/4.webp",
                "/images/weddings/5.webp",
                "/images/weddings/6.webp",
                "/images/weddings/7.webp",
                "/images/weddings/8.webp",
                "/images/weddings/9.webp",
                "/images/weddings/10.webp",
                "/images/weddings/11.webp",
                "/images/weddings/12.webp",
                "/images/weddings/13.webp",
                "/images/weddings/14.webp",
                "/images/weddings/15.webp",
                "/images/weddings/16.webp",
                "/images/weddings/17.webp",
                "/images/weddings/1.webp",
                "/images/weddings/2.webp",
                "/images/weddings/3.webp",
                "/images/weddings/4.webp",
                "/images/weddings/5.webp",
                "/images/weddings/6.webp",
                "/images/weddings/7.webp",
                "/images/weddings/8.webp",
                "/images/weddings/9.webp",
                "/images/weddings/10.webp",
                "/images/weddings/11.webp",
                "/images/weddings/12.webp",
                "/images/weddings/13.webp",
                "/images/weddings/14.webp",
                "/images/weddings/15.webp",
                "/images/weddings/16.webp",
                "/images/weddings/17.webp",
                "/images/weddings/1.webp",
                "/images/weddings/2.webp",
                "/images/weddings/3.webp",
                "/images/weddings/4.webp",
                "/images/weddings/5.webp",
                "/images/weddings/6.webp",
                "/images/weddings/7.webp",
                "/images/weddings/8.webp",
                "/images/weddings/9.webp",
                "/images/weddings/10.webp",
                "/images/weddings/11.webp",
                "/images/weddings/12.webp",
                "/images/weddings/13.webp",
                "/images/weddings/14.webp",
                "/images/weddings/15.webp",
                "/images/weddings/16.webp",
                "/images/weddings/17.webp",
              ]}
              gradientColor="rgba(234, 162, 152, 0.1)"
              className="relative z-10"
            />
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Lo último de nuestro{" "}
                <span className="font-light italic text-[#eaa298]">
                  blog de bodas
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Descubre tips, experiencias y consejos para hacer de tu boda una
                experiencia inolvidable
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué escoger un{" "}
                <span className="font-light italic text-[#eaa298]">
                  servicio de bodas de destino
                </span>
                ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                Porque nosotros, nos encargamos de absolutamente todo, para que
                solo te preocupes por disfrutar de tu boda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Destinos de ensueño
                </h3>
                <p className="text-gray-600 text-sm">
                  Lugares paradisíacos para tu boda perfecta
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Experiencia inolvidable
                </h3>
                <p className="text-gray-600 text-sm">
                  Momentos únicos que durarán para siempre
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Armamos tu boda
                </h3>
                <p className="text-gray-600 text-sm">
                  Nos encargamos de todos los detalles
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-[#eaa298]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Planificación sin stress
                </h3>
                <p className="text-gray-600 text-sm">
                  Tú solo disfruta, nosotros coordinamos todo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-[#eaa298]/5 to-[#eaa298]/10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-16 w-16 text-[#eaa298]" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Crea la boda de{" "}
                <span className="font-light italic text-[#eaa298]">
                  tus sueños
                </span>
              </h3>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed mb-8">
                <p>
                  Imagina tu día perfecto en un lugar extraordinario, rodeado de
                  belleza natural y con cada detalle cuidadosamente planificado.
                  En Gaby Top Travel, transformamos tus sueños en realidad,
                  creando bodas que van más allá de una simple celebración.
                </p>
                <p>
                  Desde destinos tropicales hasta ciudades románticas, desde
                  ceremonias íntimas hasta grandes celebraciones, nuestro equipo
                  se encarga de coordinar cada aspecto para que tu boda sea
                  exactamente como la has imaginado.
                </p>
                <p className="text-xl font-semibold text-[#eaa298]">
                  ¡Comienza a planificar tu boda perfecta hoy mismo!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template={
                    weddingTemplates.find((t) => t.isDefault)?.templateBody ||
                    "Hola, quiero cotizar mi boda de destino — {url}"
                  }
                  variables={{ url: "" }}
                  label="Cotiza HOY tu boda"
                  phone={(() => {
                    const defaultTemplate = weddingTemplates.find(
                      (t) => t.isDefault
                    );
                    if (defaultTemplate?.phoneNumber) {
                      return defaultTemplate.phoneNumber;
                    }
                    if (defaultTemplate?.phoneNumbers?.[0]) {
                      return defaultTemplate.phoneNumbers[0];
                    }
                    return "+59163051335";
                  })()}
                  size="lg"
                  className="h-14 px-8 bg-[#eaa298] hover:bg-[#d49186] text-white border-0 text-lg font-semibold rounded-xl"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-2 border-[#eaa298] text-[#eaa298] hover:bg-[#eaa298] hover:text-white rounded-xl"
                >
                  <Link
                    href="https://destinosparabodas.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conoce más
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PinkWhatsAppCTA
        variant="weddings"
        whatsappTemplate={
          weddingTemplates.find((t) => t.isDefault) || undefined
        }
        phone="+59163051335"
      />
    </div>
  );
}
