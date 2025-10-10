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
  Crown,
  Sparkles,
  Star,
  Heart,
  MapPin,
  Calendar,
  Users,
  Camera,
  Gift,
  Check,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { DepartmentType } from "@prisma/client";

export default async function QuinceaneraPage() {
  const [
    dept,
    quinceaneraDestinations,
    quinceaneraBlogPosts,
    testimonials,
    quinceaneraTemplates,
  ] = await Promise.all([
    prisma.department.findUnique({ where: { type: "QUINCEANERA" } }),
    prisma.quinceaneraDestination.findMany({
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
        type: "QUINCEANERA",
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
    // Testimonios específicos para quinceañeras
    Promise.resolve([
      {
        id: "quince-1",
        authorName: "Kattia Barrancos",
        location: null,
        rating: 5,
        content: "Gracias por todo!! Hermosa experiencia para las niñas!!",
      },
      {
        id: "quince-2",
        authorName: "Mariana Uriona",
        location: null,
        rating: 5,
        content:
          "Gracias por todo! María José muy feliz, se lleva una hermosa experiencia y nuevas amigas",
      },
      {
        id: "quince-3",
        authorName: "Mariele Prado",
        location: null,
        rating: 5,
        content:
          "Muy agradecida con cada una de las tías que cuidaron a las princesas. Muchas gracias por la paciencia y amor de las niñas. Gracias",
      },
    ]),
    prisma.whatsAppTemplate.findMany({
      where: { usageType: "QUINCEANERA" as any },
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

  const primary = (dept?.themeJson as any)?.primaryColor ?? "#e03d90";
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
            title="Tu quinceañera perfecta"
            subtitle="en el destino de tus sueños"
            description="Transforma tu celebración de 15 años en una experiencia mágica que combina tradición, aventura y momentos inolvidables. Nosotros nos encargamos de todos los detalles para que tú solo te preocupes por brillar."
            animatedWords={["Mágica", "Única", "Perfecta"]}
            backgroundImage="/images/hero/quince.webp"
            animatedWordColor="text-[#e03d90]"
            accentColor="bg-[#e03d90]"
          />
        </section>

        {/* Dream Quinceañera Locations */}
        <section className="py-16 bg-gradient-to-br from-[#e03d90]/5 to-[#e03d90]/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Lugares especiales para{" "}
                <span className="font-light italic text-[#e03d90]">
                  tu quinceañera perfecta
                </span>
              </h2>
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                <p>
                  Porque tu quinceañera merece un lugar extraordinario,
                  trabajamos con los venues más especiales del mundo. Cada lugar
                  ha sido seleccionado por su capacidad de crear momentos
                  mágicos y recuerdos que durarán para siempre.
                </p>
                <p>
                  Desde castillos de cuento de hadas hasta playas de ensueño,
                  desde jardines encantados hasta salones de baile elegantes,
                  cada venue cuenta una historia única que se convertirá en
                  parte de tu celebración especial.
                </p>
                <p>
                  Nuestro equipo conoce cada detalle de estos lugares mágicos y
                  se encarga de coordinar todos los aspectos para que tu
                  quinceañera sea exactamente como la has soñado. Tu única
                  preocupación será disfrutar cada momento de esta experiencia
                  extraordinaria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quinceanera Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestros{" "}
                <span className="font-light italic text-[#e03d90]">
                  Servicios
                </span>{" "}
                de Quinceañera
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Creamos experiencias mágicas para hacer de tu quinceañera el día
                más especial y memorable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Destinos Mágicos
                </h3>
                <p className="text-gray-600 mb-4">
                  Lugares únicos y especiales para celebrar tu quinceañera en el
                  destino perfecto
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Playas paradisíacas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Ciudades europeas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Destinos exóticos
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Celebración Completa
                </h3>
                <p className="text-gray-600 mb-4">
                  Nos encargamos de todos los detalles para que solo te
                  preocupes por disfrutar
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Ceremonia especial
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Fiesta inolvidable
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Recuerdos únicos
                  </li>
                </ul>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Experiencias Personalizadas
                </h3>
                <p className="text-gray-600 mb-4">
                  Cada quinceañera es única y la adaptamos a tus gustos y sueños
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Temáticas especiales
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Actividades únicas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#e03d90]" />
                    Momentos mágicos
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* What Makes Quinceañera Experiences Special */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Qué hace especial una{" "}
                <span className="font-light italic text-[#e03d90]">
                  quinceañera de destino
                </span>
                ?
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
                <p>
                  Las quinceañeras de destino son experiencias únicas que
                  combinan la tradición familiar con la emoción de descubrir
                  nuevos lugares. Son celebraciones que van más allá de una
                  simple fiesta, creando recuerdos inolvidables tanto para la
                  quinceañera como para toda su familia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Celebración única
                </h3>
                <p className="text-gray-600">
                  que combina tradición y aventura
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Momentos mágicos
                </h3>
                <p className="text-gray-600">en destinos extraordinarios</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Experiencia familiar
                </h3>
                <p className="text-gray-600">que une a toda la familia</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Destinos para{" "}
                <span className="font-light italic text-[#e03d90]">
                  Quinceañeras
                </span>{" "}
                de Ensueño
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre algunos de nuestros destinos más populares para
                quinceañeras especiales
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
              {quinceaneraDestinations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-[#e03d90]" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Destinos próximamente
                    </h3>
                    <p className="text-gray-600">
                      Estamos preparando destinos especiales para quinceañeras.
                      Contáctanos para conocer nuestras opciones disponibles.
                    </p>
                  </div>
                </div>
              ) : (
                quinceaneraDestinations.map((dest) => (
                  <Card
                    key={dest.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                  >
                    <div className="relative h-48 w-full">
                      {dest.heroImageUrl ? (
                        <Image
                          src={dest.heroImageUrl}
                          alt={dest.title || dest.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-[#e03d90]/20 to-[#e03d90]/10 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-[#e03d90]" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        {dest.title || dest.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-4">
                        {dest.summary ||
                          dest.description ||
                          "Destino perfecto para tu quinceañera de ensueño"}
                      </p>
                      <div className="mt-auto">
                        <Link href={`/quinceanera-destinations/${dest.slug}`}>
                          <Button
                            variant="outline"
                            className="w-full border-[#e03d90] text-[#e03d90] hover:bg-[#e03d90] hover:text-white transition-colors duration-200"
                          >
                            Ver Detalles
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Quinceañera Gallery */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#e03d90]/10 text-[#e03d90] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Camera className="w-4 h-4" />
                Galería de quinceañeras
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Quinceañeras que hemos{" "}
                <span className="text-[#e03d90] relative">
                  hecho realidad
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#e03d90] to-[#e03d90]/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Cada imagen cuenta una historia de celebración, cada detalle
                refleja nuestro compromiso con la perfección
              </p>
            </div>
          </div>

          <div className="h-screen w-full">
            <GridMotion
              items={[
                // Quinceañera gallery images from local folder - all 22 images
                "/images/quinceaneras/1.JPG",
                "/images/quinceaneras/2.JPG",
                "/images/quinceaneras/3.JPG",
                "/images/quinceaneras/4.JPG",
                "/images/quinceaneras/5.JPG",
                "/images/quinceaneras/6.JPG",
                "/images/quinceaneras/7.JPG",
                "/images/quinceaneras/8.JPG",
                "/images/quinceaneras/9.JPG",
                "/images/quinceaneras/10.JPG",
                "/images/quinceaneras/11.JPG",
                "/images/quinceaneras/12.JPG",
                "/images/quinceaneras/13.JPG",
                "/images/quinceaneras/14.JPG",
                "/images/quinceaneras/15.JPG",
                "/images/quinceaneras/16.JPG",
                "/images/quinceaneras/17.JPG",
                "/images/quinceaneras/18.JPG",
                "/images/quinceaneras/19.JPG",
                "/images/quinceaneras/20.JPG",
                "/images/quinceaneras/21.JPG",
                "/images/quinceaneras/22.JPG",
                "/images/quinceaneras/1.JPG",
                "/images/quinceaneras/2.JPG",
                "/images/quinceaneras/3.JPG",
                "/images/quinceaneras/4.JPG",
                "/images/quinceaneras/5.JPG",
                "/images/quinceaneras/6.JPG",
              ]}
              gradientColor="rgba(224, 61, 144, 0.1)"
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
                <span className="font-light italic text-[#e03d90]">
                  blog de quinceañeras
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Descubre tips, experiencias y consejos para hacer de tu
                quinceañera una celebración inolvidable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quinceaneraBlogPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-[#e03d90]" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Artículos próximamente
                    </h3>
                    <p className="text-gray-600">
                      Estamos preparando contenido especial sobre quinceañeras
                      con tips, tendencias y experiencias reales
                    </p>
                  </div>
                </div>
              ) : (
                quinceaneraBlogPosts.map((post) => (
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
                        <div className="h-full bg-gradient-to-br from-[#e03d90]/20 to-[#e03d90]/10 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-[#e03d90]" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-[#e03d90] mb-2">
                        {post.publishedAt?.toLocaleDateString() ||
                          "Fecha no disponible"}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt ||
                          "Artículo sobre quinceañeras y planificación"}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button
                          variant="outline"
                          className="w-full border-[#e03d90] text-[#e03d90] hover:bg-[#e03d90] hover:text-white transition-colors duration-200"
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
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Testimonios de{" "}
                <span className="font-light italic text-[#e03d90]">
                  Familias
                </span>{" "}
                Felices
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Lo que dicen nuestras familias sobre su experiencia con nosotros
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white p-8 rounded-lg">
                    <Star className="h-12 w-12 mx-auto mb-4 text-[#e03d90]" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Testimonios próximamente
                    </h3>
                    <p className="text-gray-600">
                      Pronto compartiremos las experiencias de nuestras familias
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
                          className="h-4 w-4 text-[#e03d90]"
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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir{" "}
                <span className="font-light italic text-[#e03d90]">
                  Gaby Top Travel
                </span>{" "}
                para tu quinceañera?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                Porque tu quinceañera merece ser perfecta, y nosotros nos
                encargamos de absolutamente todo para que tú solo te preocupes
                por disfrutar y brillar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Destinos mágicos
                </h3>
                <p className="text-gray-600 text-sm">
                  Lugares extraordinarios para tu celebración perfecta
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-[#e03d90]" />
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
                  <Users className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Organizamos tu fiesta
                </h3>
                <p className="text-gray-600 text-sm">
                  Nos encargamos de todos los detalles
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-[#e03d90]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Planificación sin estrés
                </h3>
                <p className="text-gray-600 text-sm">
                  Tú solo disfruta, nosotros coordinamos todo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-[#e03d90]/5 to-[#e03d90]/10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Crown className="h-16 w-16 text-[#e03d90]" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Haz de tu quinceañera una{" "}
                <span className="font-light italic text-[#e03d90]">
                  celebración inolvidable
                </span>
              </h3>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed mb-8">
                <p>
                  Imagina tu día perfecto en un lugar extraordinario, rodeado de
                  belleza natural y con cada detalle cuidadosamente planificado.
                  En Gaby Top Travel, transformamos tus sueños en realidad,
                  creando quinceañeras que van más allá de una simple
                  celebración.
                </p>
                <p>
                  Desde destinos tropicales hasta ciudades románticas, desde
                  ceremonias íntimas hasta grandes fiestas, nuestro equipo se
                  encarga de coordinar cada aspecto para que tu quinceañera sea
                  exactamente como la has imaginado.
                </p>
                <p className="text-xl font-semibold text-[#e03d90]">
                  ¡Comienza a planificar tu quinceañera perfecta hoy mismo!
                </p>
              </div>
              <div className="flex justify-center">
                <WhatsAppCTA
                  template={
                    quinceaneraTemplates.find(
                      (t) => t.name === "Quinceañera Quote Request"
                    )?.templateBody ||
                    "Hola, quiero cotizar mi quinceañera de destino — {url}"
                  }
                  variables={{ url: "" }}
                  label="Cotiza HOY tu quinceañera"
                  phone={(() => {
                    const quoteTemplate = quinceaneraTemplates.find(
                      (t) => t.name === "Quinceañera Quote Request"
                    );
                    if (quoteTemplate?.phoneNumber) {
                      return quoteTemplate.phoneNumber;
                    }
                    if (quoteTemplate?.phoneNumbers?.[0]) {
                      return quoteTemplate.phoneNumbers[0];
                    }
                    return "+59169671000";
                  })()}
                  size="lg"
                  className="h-14 px-8 bg-[#e03d90] hover:bg-[#c8327a] text-white border-0 text-lg font-semibold rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PinkWhatsAppCTA
        variant="quinceanera"
        whatsappTemplate={undefined}
        phone="+59169671000"
      />
    </div>
  );
}
