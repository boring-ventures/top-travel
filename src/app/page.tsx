// Avoid next/head in App Router to prevent hydration mismatches
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Hero from "@/components/views/landing-page/Hero";
import SocialProof from "@/components/views/landing-page/SocialProof";
import Features from "@/components/views/landing-page/Features";
import About from "@/components/views/landing-page/About";
import Testimonials from "@/components/views/landing-page/Testimonials";
import CTA from "@/components/views/landing-page/CTA";
import Footer from "@/components/views/landing-page/Footer";
import prisma from "@/lib/prisma";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import Partners from "@/components/views/landing-page/Partners";
import { Music2, Heart, Sparkles, MapPin } from "lucide-react";
import { filterValidImageUrls, isValidImageUrl } from "@/lib/utils";

export const metadata = {
  title: "GABYTOPTRAVEL – Viajes premium, eventos y experiencias",
  description:
    "Agencia de viajes boliviana: conciertos y eventos, Quinceañera, bodas de destino, destinos top y salidas fijas. Atención personalizada y logística segura.",
  icons: { icon: "/favicon.ico" },
};

export default async function Home() {
  let offers: any[] = [];
  let topDestinations: any[] = [];
  let featuredEvents: any[] = [];
  let departments: any[] = [];
  let fixedDepartures: any[] = [];
  let testimonials: any[] = [];

  try {
    const results = await Promise.all([
      prisma.offer.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          subtitle: true,
          bannerImageUrl: true,
          externalUrl: true,
          package: { select: { slug: true, title: true } },
        },
      }),
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
      prisma.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          locationCity: true,
          locationCountry: true,
          startDate: true,
          endDate: true,
        },
      }),
      prisma.department.findMany({
        select: {
          id: true,
          type: true,
          title: true,
          heroImageUrl: true,
          themeJson: true,
        },
      }),
      prisma.fixedDeparture.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          startDate: true,
          endDate: true,
        },
      }),
      prisma.testimonial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          authorName: true,
          location: true,
          rating: true,
          content: true,
        },
      }),
    ]);
    [
      offers,
      topDestinations,
      featuredEvents,
      departments,
      fixedDepartures,
      testimonials,
    ] = results as any;
  } catch (err) {
    console.error("Home data fetch failed", err);
  }

  const heroItems = (
    [
      ...filterValidImageUrls(offers, "bannerImageUrl").map((o) => ({
        src: o.bannerImageUrl as string,
        title: o.title,
        href: o.package?.slug
          ? `/packages/${o.package.slug}`
          : o.externalUrl || "#",
        subtitle: o.subtitle || undefined,
      })),
      ...filterValidImageUrls(topDestinations, "heroImageUrl").map((d) => ({
        src: d.heroImageUrl as string,
        title: `${d.city}, ${d.country}`,
        href: `/destinations/${d.slug}`,
      })),
    ] as { src: string; title: string; href: string; subtitle?: string }[]
  ).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative pt-24 sm:pt-28">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        <Hero items={heroItems} />
        {/* Hero CTA bar for immediate engagement */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
                Viajes premium, eventos y experiencias memorables
              </h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
                Atención personalizada y logística segura para tu próximo
                concierto, boda de destino, quinceañera o escapada soñada.
              </p>
            </div>
            <div className="shrink-0">
              <WhatsAppCTA
                template="Hola, quiero más información — {url}"
                variables={{ url: "" }}
                label="Consultar por WhatsApp"
                variant="default"
                size="lg"
              />
            </div>
          </div>
        </section>

        {/* Specialized Niches */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <AnimatedShinyText>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Especialidades
                </h2>
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground">
                Descubre nuestras experiencias más solicitadas
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Conciertos y Eventos */}
            <Card className="overflow-hidden rounded-xl">
              <Link href="/events" className="block">
                <div className="h-40 md:h-44 w-full flex items-center justify-center bg-muted">
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Music2 className="h-5 w-5" aria-hidden="true" /> Conciertos
                    y Eventos
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Accede a entradas, logística y experiencias VIP.
                  </p>
                  <div className="mt-3">
                    <Button variant="secondary" size="sm" asChild>
                      <span>Más información</span>
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
            {/* Bodas Destino */}
            <Card className="overflow-hidden rounded-xl">
              <Link href="/weddings" className="block">
                <div className="relative h-40 md:h-44 w-full">
                  {departments.find((d) => d.type === "WEDDINGS")
                    ?.heroImageUrl ? (
                    <Image
                      src={
                        departments.find((d) => d.type === "WEDDINGS")!
                          .heroImageUrl
                      }
                      alt="Bodas de destino"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5" aria-hidden="true" />
                    <span className="text-base font-medium">Bodas Destino</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Planeamos tu “sí, acepto” en el lugar perfecto.
                  </p>
                  <div className="mt-3">
                    <Button variant="secondary" size="sm" asChild>
                      <span>Más información</span>
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
            {/* Quinceañeras */}
            <Card className="overflow-hidden rounded-xl">
              <Link href="/quinceanera" className="block">
                <div className="relative h-40 md:h-44 w-full">
                  {departments.find((d) => d.type === "QUINCEANERA")
                    ?.heroImageUrl ? (
                    <Image
                      src={
                        departments.find((d) => d.type === "QUINCEANERA")!
                          .heroImageUrl
                      }
                      alt="Quinceañeras"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                    <span className="text-base font-medium">Quinceañeras</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Celebraciones únicas con estilo y seguridad.
                  </p>
                  <div className="mt-3">
                    <Button variant="secondary" size="sm" asChild>
                      <span>Más información</span>
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
            {/* Destinos Top */}
            <Card className="overflow-hidden rounded-xl">
              <Link href="/destinations" className="block">
                <div className="relative h-40 md:h-44 w-full">
                  {topDestinations[0]?.heroImageUrl &&
                  isValidImageUrl(topDestinations[0].heroImageUrl) ? (
                    <Image
                      src={topDestinations[0].heroImageUrl}
                      alt={`${topDestinations[0].city}, ${topDestinations[0].country}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    <span className="text-base font-medium">Destinos Top</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Inspiración para tu próxima aventura.
                  </p>
                  <div className="mt-3">
                    <Button variant="secondary" size="sm" asChild>
                      <span>Más información</span>
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <AnimatedShinyText>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Ofertas destacadas
                </h2>
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground">
                Promociones seleccionadas del mes
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="ml-auto sm:inline-flex hidden hover:bg-accent"
            >
              <Link href="/packages">Ver todas</Link>
            </Button>
          </div>
          {offers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay ofertas destacadas por el momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
              {offers.map((o) => {
                const href = o.package?.slug
                  ? `/packages/${o.package.slug}`
                  : o.externalUrl || "#";
                return (
                  <Card
                    key={o.id}
                    className="overflow-hidden border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <div className="group">
                      {o.bannerImageUrl && isValidImageUrl(o.bannerImageUrl) ? (
                        <Link
                          href={href}
                          className="block relative h-44 md:h-56 w-full"
                        >
                          <div className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-primary/90 px-2 py-1 text-xs text-background">
                            Destacado
                          </div>
                          <Image
                            src={o.bannerImageUrl}
                            alt={o.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        </Link>
                      ) : (
                        <div className="h-44 md:h-56 w-full bg-muted" />
                      )}
                      <div className="p-3 sm:p-4">
                        <div className="text-base sm:text-lg font-semibold text-foreground line-clamp-2">
                          {o.title}
                        </div>
                        {o.subtitle ? (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {o.subtitle}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <Link
                            href={href}
                            className="text-sm text-primary/80 hover:text-primary underline underline-offset-4"
                          >
                            Ver detalle
                          </Link>
                          <WhatsAppCTA
                            template="Hola, me interesa {itemTitle} — {url}"
                            variables={{ itemTitle: o.title, url: "" }}
                            label="Consultar"
                            variant="secondary"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <AnimatedShinyText>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Destinos destacados
                </h2>
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground">
                Inspírate con nuestra selección
              </p>
            </div>
            <div className="hidden sm:block">
              <Button asChild variant="ghost" className="hover:bg-accent">
                <Link href="/destinations">Explorar</Link>
              </Button>
            </div>
          </div>
          {topDestinations.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aún no hay destinos destacados.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {topDestinations.map((d) => (
                <Card key={d.id} className="overflow-hidden rounded-xl">
                  <Link href={`/destinations/${d.slug}`} className="block">
                    <div className="relative h-28 sm:h-32 w-full">
                      {d.heroImageUrl && isValidImageUrl(d.heroImageUrl) ? (
                        <Image
                          src={d.heroImageUrl}
                          alt={`${d.city}, ${d.country}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 16vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <div className="p-3 text-[0.8rem] sm:text-sm">
                      {d.city}, {d.country}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <AnimatedShinyText>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Departamentos
                </h2>
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground">
                Experiencias temáticas
              </p>
            </div>
          </div>
          {departments.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Pronto publicaremos departamentos.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {departments.map((dep) => (
                <Card key={dep.id} className="rounded-xl overflow-hidden">
                  <Link
                    href={
                      dep.type === "WEDDINGS" ? "/weddings" : "/quinceanera"
                    }
                    className="block"
                  >
                    <div className="relative h-36 sm:h-40 w-full">
                      {dep.heroImageUrl && isValidImageUrl(dep.heroImageUrl) ? (
                        <Image
                          src={dep.heroImageUrl}
                          alt={dep.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="font-medium">
                        {dep.type === "WEDDINGS"
                          ? "Bodas de destino"
                          : "Quinceañera"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dep.title}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <AnimatedShinyText>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Próximos eventos
                </h2>
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground">
                Fechas y lugares destacados
              </p>
            </div>
            <div className="hidden sm:block">
              <Button asChild variant="ghost" className="hover:bg-accent">
                <Link href="/events">Ver eventos</Link>
              </Button>
            </div>
          </div>
          {featuredEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay eventos próximos.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {featuredEvents.map((e, idx) => (
                <Card
                  key={e.id}
                  className="border-border/60 hover:border-primary/40 transition-colors"
                >
                  <Link href={`/events/${e.slug}`} className="block p-4 sm:p-5">
                    <BlurFade delay={idx * 0.05}>
                      <div className="font-medium text-foreground">
                        {e.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
                      </div>
                    </BlurFade>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <AnimatedShinyText>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Salidas fijas
                </h2>
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground">
                Fechas y cupos limitados
              </p>
            </div>
            <div className="hidden sm:block">
              <Button asChild variant="ghost" className="hover:bg-accent">
                <Link href="/fixed-departures">Ver todas</Link>
              </Button>
            </div>
          </div>
          {fixedDepartures.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay salidas fijas disponibles.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {fixedDepartures.map((fd, idx) => (
                <Card
                  key={fd.id}
                  className="border-border/60 hover:border-primary/40 transition-colors"
                >
                  <Link
                    href={`/fixed-departures/${fd.slug}`}
                    className="block p-4 sm:p-5"
                  >
                    <BlurFade delay={idx * 0.05}>
                      <div className="font-medium text-foreground">
                        {fd.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(fd.startDate), "yyyy-MM-dd")} –{" "}
                        {format(new Date(fd.endDate), "yyyy-MM-dd")}
                      </div>
                    </BlurFade>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <SocialProof />
        <Features />
        <About />
        <Partners />
        <Testimonials items={testimonials} />
        <CTA />
      </main>

      {/* Persistent WhatsApp CTA - bottom right */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <WhatsAppCTA
            template="Hola, me gustaría hablar con un asesor — {url}"
            variables={{ url: "" }}
            label="WhatsApp"
            variant="default"
            size="lg"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
