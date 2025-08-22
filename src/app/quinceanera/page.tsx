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
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";

export default async function QuinceaneraPage() {
  const [dept, destinations, testimonials] = await Promise.all([
    prisma.department.findUnique({ where: { type: "QUINCEANERA" } }),
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
  const fallbackHero =
    "https://images.unsplash.com/photo-1640827013600-1f5411ec366b?w=1200&h=800&fit=crop&crop=center";
  const heroSrc = hero || fallbackHero;

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
          aria-label="Sección Quinceañera"
          role="region"
        >
          <div className="absolute inset-0 -z-10">
            {heroSrc ? (
              <Image
                src={heroSrc}
                alt="Quinceañera"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-violet-700" />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg">
                Celebra su Quinceañera
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  con un Tour de Ensueño
                </span>
              </h1>
              <p className="mt-4 sm:mt-6 text-white/90 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Creamos recorridos inolvidables a medida: destinos increíbles,
                detalles personalizados y logística completa para que disfruten
                sin preocupaciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Experiencias únicas
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Recuerdos inolvidables
                  </span>
                </div>
              </div>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola, quiero planificar un tour de Quinceañera — {url}"
                  variables={{ url: "" }}
                  label="Planifica su tour ahora"
                  size="lg"
                  className="rounded-full h-14 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 text-lg font-semibold"
                />
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full h-14 px-8 text-lg font-semibold"
                >
                  <Link href="/destinations">Ver destinos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              ¿Por qué elegirnos para su Quinceañera?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hacemos que cada momento sea especial y memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <ShineBorder className="rounded-xl w-full" borderWidth={1}>
              <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <Users
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-2 text-foreground">
                      Planificación experta
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      Coordinamos vuelos, hoteles, actividades y celebraciones
                      para una experiencia sin estrés.
                    </div>
                  </div>
                </div>
              </Card>
            </ShineBorder>

            <ShineBorder className="rounded-xl w-full" borderWidth={1}>
              <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-xl">
                    <Heart
                      className="h-6 w-6 text-pink-600 dark:text-pink-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-2 text-foreground">
                      Toque personalizado
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      Diseñamos el tour según sus gustos e intereses para un
                      recuerdo verdaderamente único.
                    </div>
                  </div>
                </div>
              </Card>
            </ShineBorder>

            <ShineBorder className="rounded-xl w-full" borderWidth={1}>
              <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                    <ShieldCheck
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-2 text-foreground">
                      Seguridad y soporte 24/7
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      Acompañamiento permanente y estándares de seguridad en
                      cada detalle del viaje.
                    </div>
                  </div>
                </div>
              </Card>
            </ShineBorder>
          </div>
        </section>

        {/* Featured destinations */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Destinos destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lugares mágicos para celebrar este momento tan especial
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
                    Estamos preparando destinos especiales para quinceañeras
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
                          <div className="h-full w-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
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
                          Inspírate para su celebración soñada.
                        </div>
                      </div>
                    </Link>
                  </Card>
                </ShineBorder>
              ))
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Familias felices
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lo que dicen nuestras familias satisfechas
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
                      Próximamente testimonios de quinceañeras.
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
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
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
                          className="h-4 w-4 text-primary"
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

        {/* Sample itinerary */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Itinerario sugerido: Quinceañera en París
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un ejemplo de cómo puede ser su experiencia perfecta
            </p>
          </div>

          <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
            <Card className="p-8 sm:p-12 bg-transparent border-0 shadow-xl">
              <div className="grid grid-cols-[32px_1fr] gap-x-6 gap-y-8">
                {/* Día 1 */}
                <div className="flex flex-col items-center pt-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <Plane
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="w-px bg-border grow mt-2" />
                </div>
                <div className="py-3">
                  <p className="text-lg font-bold mb-2 text-foreground">
                    Día 1: Llegada a París y cena especial con vista a la Torre
                    Eiffel
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Bienvenida a la Ciudad de las Luces. Check-in y cena de
                    celebración.
                  </p>
                </div>

                {/* Día 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-px bg-border h-4" />
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                    <Archive
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="w-px bg-border grow mt-2" />
                </div>
                <div className="py-3">
                  <p className="text-lg font-bold mb-2 text-foreground">
                    Día 2: Museo del Louvre y crucero por el Sena
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Arte y vistas románticas en el corazón de París.
                  </p>
                </div>

                {/* Día 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-px bg-border h-4" />
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-full">
                    <ShoppingBag
                      className="h-5 w-5 text-pink-600 dark:text-pink-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="w-px bg-border grow mt-2" />
                </div>
                <div className="py-3">
                  <p className="text-lg font-bold mb-2 text-foreground">
                    Día 3: Palacio de Versalles y compras parisinas
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Historia, glamour y vitrinas icónicas.
                  </p>
                </div>

                {/* Día 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-px bg-border h-4" />
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                    <Castle
                      className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="w-px bg-border grow mt-2" />
                </div>
                <div className="py-3">
                  <p className="text-lg font-bold mb-2 text-foreground">
                    Día 4: Disneyland Paris
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Diversión y momentos mágicos para toda la familia.
                  </p>
                </div>

                {/* Día 5 */}
                <div className="flex flex-col items-center pb-3">
                  <div className="w-px bg-border h-4" />
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <Plane
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="py-3">
                  <p className="text-lg font-bold mb-2 text-foreground">
                    Día 5: Regreso
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vuelve a casa con recuerdos que durarán toda la vida.
                  </p>
                </div>
              </div>
            </Card>
          </ShineBorder>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
            <Card className="p-12 sm:p-16 text-center bg-transparent border-0 shadow-xl">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-foreground">
                ¿Listos para comenzar a planificar su Quinceañera inolvidable?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contáctanos para una asesoría gratuita y creemos juntas el viaje
                soñado.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppCTA
                  template="Hola, quiero una asesoría para Quinceañera — {url}"
                  variables={{ url: "" }}
                  label="Hablar por WhatsApp"
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
