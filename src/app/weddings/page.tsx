import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
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
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";

export default async function WeddingsPage() {
  const [dept, destinations, testimonials] = await Promise.all([
    prisma.department.findUnique({ where: { type: "WEDDINGS" } }),
    prisma.destination.findMany({
      where: { isFeatured: true },
      take: 6,
      select: {
        id: true,
        slug: true,
        city: true,
        country: true,
        heroImageUrl: true,
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero */}
        <section
          className="relative overflow-hidden pt-20 sm:pt-24"
          aria-label="Weddings"
          role="region"
        >
          <div className="absolute inset-0 -z-10">
            {hero ? (
              <Image
                src={hero}
                alt="Weddings"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-600 to-red-700" />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg">
                Tu Boda de Destino
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Perfectamente Planificada
                </span>
              </h1>
              <p className="mt-4 sm:mt-6 text-white/90 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Déjanos manejar cada detalle, desde la selección del lugar hasta
                el catering, para que puedas enfocarte en celebrar tu amor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">Experiencia única</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Atención personalizada
                  </span>
                </div>
              </div>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola! Me gustaría planificar mi boda de destino — {url}"
                  variables={{ url: "" }}
                  label="Comenzar Planificación"
                  size="lg"
                  className="rounded-full h-14 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 text-lg font-semibold"
                />
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full h-14 px-8 text-lg font-semibold"
                >
                  <Link href="/destinations">Explorar Destinos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Destinos Destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lugares mágicos para celebrar el día más especial de tu vida
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {destinations.length === 0 ? (
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
              destinations.map((d) => (
                <ShineBorder
                  key={d.id}
                  className="rounded-xl w-full"
                  borderWidth={1}
                >
                  <Card className="flex h-full flex-col gap-4 p-4 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="block flex-1"
                    >
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
                        {d.heroImageUrl ? (
                          <Image
                            src={d.heroImageUrl}
                            alt={`${d.city}, ${d.country}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-2">
                        <div className="text-lg font-bold mb-2 text-foreground">
                          {d.city}, {d.country}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Intercambia votos en un entorno impresionante.
                        </div>
                      </div>
                    </Link>
                  </Card>
                </ShineBorder>
              ))
            )}
          </div>
        </section>

        {/* Packages */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Paquetes Personalizables
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nuestros paquetes de boda son flexibles. Adapta lugares, catering
              y actividades para crear una celebración que refleje tu historia
              de amor única.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Básico",
                price: "$5,000",
                features: [
                  "Selección de lugar",
                  "Catering básico",
                  "Fotografía",
                ],
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Premium",
                price: "$10,000",
                features: [
                  "Lugar premium",
                  "Catering gourmet",
                  "Fotografía y videografía",
                  "Entretenimiento",
                ],
                color: "from-purple-500 to-purple-600",
              },
              {
                name: "Lujo",
                price: "$20,000",
                features: [
                  "Lugar exclusivo",
                  "Catering de lujo",
                  "Fotografía y videografía",
                  "Entretenimiento",
                  "Servicio de conserjería personalizado",
                ],
                color: "from-pink-500 to-pink-600",
              },
            ].map((p) => (
              <ShineBorder
                key={p.name}
                className="rounded-xl w-full"
                borderWidth={1}
              >
                <Card className="p-8 flex flex-col gap-6 bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {p.name}
                    </h3>
                    <p className="flex items-baseline gap-1">
                      <span
                        className="text-4xl font-extrabold"
                        style={{ color: primary }}
                      >
                        {p.price}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        por boda
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className={`h-12 rounded-xl bg-gradient-to-r ${p.color} hover:opacity-90 text-white border-0`}
                  >
                    Seleccionar Plan
                  </Button>
                  <div className="flex flex-col gap-3 flex-1">
                    {p.features.map((f) => (
                      <div key={f} className="text-sm flex items-start gap-3">
                        <Check
                          className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </ShineBorder>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Testimonios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lo que dicen nuestras parejas felices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <ShineBorder
                  className="rounded-xl inline-block w-full"
                  borderWidth={1}
                >
                  <Card className="p-8 text-muted-foreground bg-transparent border-0">
                    <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg text-foreground">
                      Próximamente testimonios de bodas.
                    </p>
                  </Card>
                </ShineBorder>
              </div>
            ) : (
              testimonials.map((t) => (
                <ShineBorder
                  key={t.id}
                  className="rounded-xl w-full"
                  borderWidth={1}
                >
                  <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {t.authorName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold leading-tight text-foreground">
                          {t.authorName}
                        </div>
                        <div className="text-sm text-muted-foreground leading-tight">
                          {t.location ?? ""}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({
                        length: Math.max(0, Math.min(5, t.rating ?? 5)),
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
                          style={{ color: primary }}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {t.content}
                    </p>
                  </Card>
                </ShineBorder>
              ))
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
            <Card className="p-12 sm:p-16 text-center bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 border-0 shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <ShineBorder className="rounded-full p-3" borderWidth={1}>
                  <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </ShineBorder>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-foreground">
                ¿Listo para Planificar tu Boda de Ensueño?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contáctanos hoy para una consulta gratuita y déjanos ayudarte a
                crear la boda de tus sueños.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola, quiero una cotización gratuita para mi boda — {url}"
                  variables={{ url: "" }}
                  label="Obtener Cotización Gratuita"
                  size="lg"
                  className="rounded-full h-14 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 text-lg font-semibold"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full h-14 px-8 text-lg font-semibold border-2"
                >
                  <Link href="/contact">Más Información</Link>
                </Button>
              </div>
            </Card>
          </ShineBorder>
        </section>
      </main>

      <Footer />
    </div>
  );
}
