import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import {
  Users,
  Heart,
  ShieldCheck,
  Plane,
  Archive,
  ShoppingBag,
  Castle,
  Star,
  Sparkles,
  Crown,
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { BlogPostsSectionServer } from "@/components/views/landing-page/BlogPostsSectionServer";
import { DepartmentType } from "@prisma/client";
import { AnimatedText } from "@/components/ui/animated-text";

export default async function QuinceaneraPage() {
  const [
    dept,
    quinceaneraDestinations,
    quinceaneraPackages,
    testimonials,
    blogPosts,
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
        description: true,
        heroImageUrl: true,
      },
    }),
    prisma.package.findMany({
      where: {
        status: "PUBLISHED",
        isCustom: false,
      },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        heroImageUrl: true,
        fromPrice: true,
        currency: true,
        durationDays: true,
        inclusions: true,
      },
    }),
    prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        authorName: true,
        location: true,
        rating: true,
        content: true,
      },
    }),
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        type: "QUINCEANERA",
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        heroImageUrl: true,
        author: true,
        publishedAt: true,
        type: true,
      },
    }),
  ]);

  const primary = (dept?.themeJson as any)?.primaryColor ?? "#ee2b8d";
  const accent = (dept?.themeJson as any)?.accentColor ?? "#fcf8fa";
  const hero = dept?.heroImageUrl;
  const fallbackHero =
    "https://images.unsplash.com/photo-1640827013600-1f5411ec366b?w=1200&h=800&fit=crop&crop=center";
  const heroSrc = hero || fallbackHero;

  // Extract CMS content with fallbacks
  const heroContent = (dept?.heroContentJson as any) || {};
  const services = (dept?.servicesJson as any) || [];
  const contactInfo = (dept?.contactInfoJson as any) || {};
  const additionalContent = (dept?.additionalContentJson as any) || {};

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Hero Section */}
        <section className="h-screen">
          <div className="h-full bg-white shadow-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="p-16 lg:p-24 flex flex-col justify-center h-full">
              <div className="max-w-2xl">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  <div className="block">
                    <AnimatedText words={["Sueños", "Aventuras", "Viajes"]} />
                  </div>
                  <div className="block">de Quinceañera</div>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Creamos recorridos inolvidables a medida: destinos increíbles,
                  detalles personalizados y logística completa para que
                  disfruten sin preocupaciones.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-rose-500 text-white px-8 py-4 hover:bg-rose-600 font-semibold text-lg transition-colors duration-200 border-0"
                  >
                    <Link href="/contact">Planificar Tour</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-gray-700 px-8 py-4 hover:bg-gray-50 font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    <Link href="/destinations">Ver Destinos</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="h-full relative">
              <Image
                alt="Quinceañera celebration"
                src={heroSrc}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="py-16 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                ¿Por qué elegirnos para su{" "}
                <span className="font-light italic text-rose-500">
                  Quinceañera
                </span>
                ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hacemos que cada momento sea especial y memorable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 flex items-center justify-center mx-auto">
                    <Crown className="h-10 w-10 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Experiencia Real
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Más de 500 quinceañeras han vivido experiencias únicas con
                  nosotros. Cada celebración es una obra de arte.
                </p>
              </div>

              <div className="group text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 flex items-center justify-center mx-auto">
                    <Sparkles className="h-10 w-10 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Magia Personalizada
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cada detalle está pensado para ella. Desde la decoración hasta
                  las actividades, todo refleja su personalidad.
                </p>
              </div>

              <div className="group text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 flex items-center justify-center mx-auto">
                    <Star className="h-10 w-10 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Memorias Eternas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Creamos momentos que durarán para siempre. Fotografía
                  profesional, videos y recuerdos únicos incluidos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured destinations */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Destinos para{" "}
                <span className="font-light italic text-rose-500">
                  Quinceañeras
                </span>{" "}
                de Ensueño
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Lugares mágicos para celebrar este momento tan especial
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quinceaneraDestinations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gray-50 p-12 max-w-md mx-auto">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600">
                      Próximamente destinos especiales para quinceañeras.
                    </p>
                  </div>
                </div>
              ) : (
                quinceaneraDestinations.map((d) => (
                  <div
                    key={d.id}
                    className="relative overflow-hidden rounded-lg group"
                  >
                    <Link
                      href={`/quinceanera-destinations/${d.slug}`}
                      className="block"
                    >
                      <div className="relative h-64 sm:h-72">
                        {d.heroImageUrl ? (
                          <Image
                            src={d.heroImageUrl}
                            alt={d.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent p-6 flex flex-col justify-start">
                          <div>
                            <h3 className="text-white text-xl font-semibold uppercase">
                              {d.name}
                            </h3>
                            <p className="text-white">
                              {d.description ||
                                "Celebra sus 15 años en un lugar mágico"}
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                          <div className="flex justify-between items-center">
                            <p className="text-white text-lg font-bold">
                              {d.title}
                            </p>
                            <div className="text-white">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Paquetes{" "}
                <span className="font-light italic text-rose-500">
                  Personalizables
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nuestros paquetes de quinceañera son flexibles. Adapta lugares,
                actividades y experiencias para crear una celebración que
                refleje su personalidad única.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quinceaneraPackages.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Paquetes próximamente
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Estamos preparando paquetes especiales para quinceañeras
                    </p>
                  </div>
                </div>
              ) : (
                quinceaneraPackages.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 h-full flex flex-col"
                  >
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {p.title}
                        </h3>
                        {p.fromPrice && (
                          <p className="text-4xl font-bold text-rose-500">
                            {p.currency === "USD" ? "$" : "Bs"}{" "}
                            {p.fromPrice.toLocaleString()}
                            {p.durationDays && (
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                / {p.durationDays} días
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      {p.summary && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">{p.summary}</p>
                        </div>
                      )}
                      <div className="mb-6 flex-grow">
                        {p.inclusions && p.inclusions.length > 0 && (
                          <>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                              Incluye:
                            </h4>
                            <ul className="space-y-2">
                              {p.inclusions
                                .slice(0, 4)
                                .map((inclusion, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center text-sm text-gray-600"
                                  >
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-3 flex-shrink-0"></div>
                                    {inclusion}
                                  </li>
                                ))}
                              {p.inclusions.length > 4 && (
                                <li className="text-sm text-gray-500 italic">
                                  +{p.inclusions.length - 4} más...
                                </li>
                              )}
                            </ul>
                          </>
                        )}
                      </div>
                      <Button
                        asChild
                        className="w-full bg-rose-500 text-white hover:bg-rose-600 transition-colors duration-200 border-0 mt-auto"
                      >
                        <Link href={`/packages/${p.slug}`}>Ver Detalles</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Nuestros{" "}
                <span className="font-light italic text-rose-500">
                  Testimonios
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Lo que dicen nuestras familias satisfechas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {testimonials.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="bg-gray-50 p-12 max-w-md mx-auto">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600">
                      Próximamente testimonios de quinceañeras.
                    </p>
                  </div>
                </div>
              ) : (
                testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                  >
                    <div className="mb-6">
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        {t.authorName}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {t.location ?? ""}
                      </div>
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({
                          length: Math.max(0, Math.min(5, t.rating ?? 5)),
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "{t.content}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Sample itinerary */}
        {additionalContent?.sampleItinerary?.days?.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                {additionalContent.sampleItinerary.title ||
                  "Itinerario sugerido: Quinceañera en París"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {additionalContent.sampleItinerary.description ||
                  "Un ejemplo de cómo puede ser su experiencia perfecta"}
              </p>
            </div>

            <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
              <Card className="p-8 sm:p-12 bg-transparent border-0 shadow-xl">
                <div className="grid grid-cols-[32px_1fr] gap-x-6 gap-y-8">
                  {additionalContent.sampleItinerary.days.map(
                    (day: any, index: number) => {
                      // Map icon names to actual icons
                      const getIcon = (iconName: string) => {
                        switch (iconName) {
                          case "Plane":
                            return Plane;
                          case "Archive":
                            return Archive;
                          case "ShoppingBag":
                            return ShoppingBag;
                          case "Castle":
                            return Castle;
                          case "Building2":
                            return Building2;
                          default:
                            return Plane;
                        }
                      };

                      const IconComponent = getIcon(day.icon);
                      const colors = [
                        { bg: "bg-blue-100", text: "text-blue-600" },
                        { bg: "bg-purple-100", text: "text-purple-600" },
                        { bg: "bg-pink-100", text: "text-pink-600" },
                        { bg: "bg-yellow-100", text: "text-yellow-600" },
                        { bg: "bg-green-100", text: "text-green-600" },
                      ];
                      const color = colors[index % colors.length];
                      const isLast =
                        index ===
                        additionalContent.sampleItinerary.days.length - 1;

                      return (
                        <div key={index} className="contents">
                          <div
                            className={`flex flex-col items-center ${isLast ? "pb-3" : ""} ${index > 0 ? "" : "pt-3"}`}
                          >
                            {index > 0 && (
                              <div className="w-px bg-border h-4" />
                            )}
                            <div className={`p-2 ${color.bg} rounded-full`}>
                              <IconComponent
                                className={`h-5 w-5 ${color.text}`}
                                aria-hidden="true"
                              />
                            </div>
                            {!isLast && (
                              <div className="w-px bg-border grow mt-2" />
                            )}
                          </div>
                          <div className="py-3">
                            <p className="text-lg font-bold mb-2 text-foreground">
                              {day.title}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                              {day.description}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Card>
            </ShineBorder>
          </section>
        )}

        {/* Blog Posts Section */}
        <BlogPostsSectionServer
          posts={blogPosts}
          title="Guía para tu Quinceañera"
          description="Todo lo que necesitas saber para planificar la celebración perfecta de los 15 años"
          type={DepartmentType.QUINCEANERA}
        />

        {/* Final CTA */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-pink-600" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-6">
                ¿Listo para Planificar su{" "}
                <span className="font-light italic text-rose-500">
                  Quinceañera
                </span>{" "}
                de Ensueño?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Contáctanos hoy para una consulta gratuita y déjanos ayudarte a
                crear la quinceañera de sus sueños.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola, quiero una cotización gratuita para Quinceañera — {url}"
                  variables={{ url: "" }}
                  label="Obtener Cotización Gratuita"
                  size="lg"
                  className="h-14 px-8 bg-black hover:bg-gray-800 text-white border-0 text-lg font-semibold rounded-none"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-none"
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
