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
} from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section
          className="relative overflow-hidden"
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
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100" />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15))`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Celebra su Quinceañera con un tour de ensueño
              </h1>
              <p className="mt-3 sm:mt-4 text-white/90 text-base sm:text-lg">
                Creamos recorridos inolvidables a medida: destinos increíbles,
                detalles personalizados y logística completa para que disfruten
                sin preocupaciones.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <WhatsAppCTA
                  template="Hola, quiero planificar un tour de Quinceañera — {url}"
                  variables={{ url: "" }}
                  label="Planifica su tour ahora"
                  size="lg"
                  className="rounded-full h-12 px-5"
                />
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full h-12 px-5"
                >
                  <Link href="/destinations">Ver destinos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            ¿Por qué elegirnos para su Quinceañera?
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-foreground" aria-hidden="true" />
                <div>
                  <div className="font-semibold">Planificación experta</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Coordinamos vuelos, hoteles, actividades y celebraciones
                    para una experiencia sin estrés.
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 text-foreground" aria-hidden="true" />
                <div>
                  <div className="font-semibold">Toque personalizado</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Diseñamos el tour según sus gustos e intereses para un
                    recuerdo verdaderamente único.
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="h-6 w-6 text-foreground"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-semibold">Seguridad y soporte 24/7</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Acompañamiento permanente y estándares de seguridad en cada
                    detalle del viaje.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Featured destinations */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Destinos destacados
          </h2>
          <div className="mt-6 flex overflow-x-auto gap-3 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch gap-3">
              {destinations.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Pronto publicaremos destinos destacados.
                </div>
              ) : (
                destinations.map((d) => (
                  <Card
                    key={d.id}
                    className="flex h-full min-w-60 flex-1 flex-col gap-3 p-3"
                  >
                    <Link href={`/destinations/${d.slug}`} className="block">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        {d.heroImageUrl ? (
                          <Image
                            src={d.heroImageUrl}
                            alt={`${d.city}, ${d.country}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 80vw, 30vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="text-base font-medium">
                          {d.city}, {d.country}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Inspírate para su celebración soñada.
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Familias felices
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="text-base font-medium leading-tight">
                      {t.authorName}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {t.location ?? ""}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
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
                <p className="mt-3 text-sm text-foreground">{t.content}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Sample itinerary */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Itinerario sugerido: Quinceañera en París
          </h2>
          <div className="mt-4 grid grid-cols-[32px_1fr] gap-x-3">
            {/* Día 1 */}
            <div className="flex flex-col items-center pt-3">
              <Plane className="h-5 w-5" aria-hidden="true" />
              <div className="w-px bg-border grow mt-1" />
            </div>
            <div className="py-3">
              <p className="text-base font-medium">
                Día 1: Llegada a París y cena especial con vista a la Torre
                Eiffel
              </p>
              <p className="text-sm text-muted-foreground">
                Bienvenida a la Ciudad de las Luces. Check-in y cena de
                celebración.
              </p>
            </div>
            {/* Día 2 */}
            <div className="flex flex-col items-center">
              <div className="w-px bg-border h-2" />
              <Archive className="h-5 w-5" aria-hidden="true" />
              <div className="w-px bg-border grow mt-1" />
            </div>
            <div className="py-3">
              <p className="text-base font-medium">
                Día 2: Museo del Louvre y crucero por el Sena
              </p>
              <p className="text-sm text-muted-foreground">
                Arte y vistas románticas en el corazón de París.
              </p>
            </div>
            {/* Día 3 */}
            <div className="flex flex-col items-center">
              <div className="w-px bg-border h-2" />
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <div className="w-px bg-border grow mt-1" />
            </div>
            <div className="py-3">
              <p className="text-base font-medium">
                Día 3: Palacio de Versalles y compras parisinas
              </p>
              <p className="text-sm text-muted-foreground">
                Historia, glamour y vitrinas icónicas.
              </p>
            </div>
            {/* Día 4 */}
            <div className="flex flex-col items-center">
              <div className="w-px bg-border h-2" />
              <Castle className="h-5 w-5" aria-hidden="true" />
              <div className="w-px bg-border grow mt-1" />
            </div>
            <div className="py-3">
              <p className="text-base font-medium">Día 4: Disneyland Paris</p>
              <p className="text-sm text-muted-foreground">
                Diversión y momentos mágicos para toda la familia.
              </p>
            </div>
            {/* Día 5 */}
            <div className="flex flex-col items-center pb-3">
              <div className="w-px bg-border h-2" />
              <Plane className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="py-3">
              <p className="text-base font-medium">Día 5: Regreso</p>
              <p className="text-sm text-muted-foreground">
                Vuelve a casa con recuerdos que durarán toda la vida.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              ¿Listos para comenzar a planificar su Quinceañera inolvidable?
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Contáctanos para una asesoría gratuita y creemos juntas el viaje
              soñado.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <WhatsAppCTA
                template="Hola, quiero una asesoría para Quinceañera — {url}"
                variables={{ url: "" }}
                label="Hablar por WhatsApp"
                size="lg"
                className="rounded-full h-12 px-5"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
