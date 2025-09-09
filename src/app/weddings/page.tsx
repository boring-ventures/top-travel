import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { AnimatedText } from "@/components/ui/animated-text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import {
  Check,
  Star,
  Sparkles,
  Heart,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  BookOpen,
  User,
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";

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
        take: 4,
        select: {
          id: true,
          authorName: true,
          location: true,
          rating: true,
          content: true,
        },
      }),
    ]);

  const primary = (dept?.themeJson as any)?.primaryColor ?? "#ee2b8d";
  const accent = (dept?.themeJson as any)?.accentColor ?? "#fcf8fa";
  const hero = dept?.heroImageUrl;

  // Extract CMS content with fallbacks
  const heroContent = (dept as any)?.heroContentJson || {};
  const cmsPackages = (dept as any)?.packagesJson || [];
  const services = (dept?.servicesJson as any) || [];
  const contactInfo = (dept?.contactInfoJson as any) || {};

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="h-screen">
          <div className="h-full bg-white shadow-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="p-16 lg:p-24 flex flex-col justify-center h-full">
              <div className="max-w-2xl">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  <div className="block whitespace-nowrap">
                    Bodas de Destino
                  </div>
                  <div className="block">
                    <AnimatedText
                      words={[
                        "Soñadas",
                        "Románticas",
                        "Únicas",
                        "Perfectas",
                        "Inolvidables",
                      ]}
                      color="text-gold"
                    />
                  </div>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Di "Sí, acepto" en el paraíso. Nuestros paquetes exclusivos de
                  bodas ofrecen experiencias inolvidables en los destinos más
                  románticos del mundo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gold text-white px-8 py-4 hover:bg-gold-light font-semibold text-lg transition-colors duration-200 border-0"
                  >
                    <Link href="/packages">Explorar Paquetes</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-gray-700 px-8 py-4 hover:bg-gray-50 font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    <Link href="/contact">Contactar Planificador</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="h-full relative">
              <Image
                alt="Couple getting married on a tropical beach"
                src={
                  hero ||
                  "https://images.pexels.com/photos/33715721/pexels-photo-33715721.jpeg?auto=compress&cs=tinysrgb&w=1000&h=667&fit=crop"
                }
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Destinos para{" "}
                <span className="font-light italic text-gold">Bodas</span> de
                Ensueño
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Lugares mágicos para celebrar el día más especial de tu vida
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddingDestinations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Destinos próximamente
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Estamos preparando destinos especiales para bodas
                    </p>
                  </div>
                </div>
              ) : (
                weddingDestinations.map((d) => (
                  <div
                    key={d.id}
                    className="relative overflow-hidden rounded-lg group"
                  >
                    <Link
                      href={`/wedding-destinations/${d.slug}`}
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
                          <div className="h-full w-full bg-gradient-to-br from-yellow-100 to-gold/20 flex items-center justify-center">
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
                                "Intercambia votos en un entorno impresionante"}
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

        {/* Blog Posts */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Consejos y{" "}
                <span className="font-light italic text-gold">Inspiración</span>{" "}
                para Bodas
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Descubre tips, tendencias y experiencias reales para hacer de tu
                boda un día perfecto
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddingBlogPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Artículos próximamente
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Estamos preparando contenido especial sobre bodas
                    </p>
                  </div>
                </div>
              ) : (
                weddingBlogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 h-full flex flex-col group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {post.heroImageUrl ? (
                        <Image
                          src={post.heroImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-pink-100 to-gold/20 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          {post.author && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {post.author}
                            </div>
                          )}
                          {post.publishedAt && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.publishedAt).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-gold text-gold hover:bg-gold hover:text-white transition-colors duration-200"
                        >
                          <Link href={`/blog/${post.slug}`}>Leer Más</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {weddingBlogPosts.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gold text-gold hover:bg-gold hover:text-white transition-colors duration-200"
                >
                  <Link href="/blog?type=WEDDINGS">Ver Todos los Artículos</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Nuestros{" "}
                <span className="font-light italic text-gold">Testimonios</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Lo que dicen nuestras parejas felices
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {testimonials.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="bg-gray-50 p-12 max-w-md mx-auto">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600">
                      Próximamente testimonios de bodas.
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

        {/* Final CTA */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-gold" />
              </div>
              <h3 className="text-5xl font-bold text-gray-900 mb-6">
                ¿Listo para Planificar tu{" "}
                <span className="font-light italic text-gold">Boda</span> de
                Ensueño?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Contáctanos hoy para una consulta gratuita y déjanos ayudarte a
                crear la boda de tus sueños.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola, quiero una cotización gratuita para mi boda — {url}"
                  variables={{ url: "" }}
                  label="Obtener Cotización Gratuita"
                  size="lg"
                  className="h-14 px-8 bg-black hover:bg-gray-800 text-white border-0 text-lg font-semibold rounded-none"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-2 rounded-none"
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
