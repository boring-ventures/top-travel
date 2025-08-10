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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const metadata = {
  title: "GABYTOPTRAVEL – Viajes premium, eventos y experiencias",
  description:
    "Agencia de viajes boliviana: conciertos y eventos, Quinceañera, bodas de destino, destinos top y salidas fijas. Atención personalizada y logística segura.",
  icons: { icon: "/favicon.ico" },
};

export default async function Home() {
  const [
    offers,
    topDestinations,
    featuredEvents,
    departments,
    fixedDepartures,
    testimonials,
  ] = await Promise.all([
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        <Hero />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Ofertas destacadas</h2>
              <p className="text-sm text-muted-foreground">
                Promociones seleccionadas del mes
              </p>
            </div>
          </div>
          {offers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay ofertas destacadas por el momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {offers.map((o) => {
                const href = o.package?.slug
                  ? `/packages/${o.package.slug}`
                  : o.externalUrl || "#";
                return (
                  <Card key={o.id} className="overflow-hidden">
                    {o.bannerImageUrl ? (
                      <div className="relative h-44 w-full">
                        <Image
                          src={o.bannerImageUrl}
                          alt={o.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg">
                        {o.title}
                      </CardTitle>
                      {o.subtitle ? (
                        <CardDescription className="text-sm">
                          {o.subtitle}
                        </CardDescription>
                      ) : null}
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          asChild
                          variant="link"
                          className="px-0 h-auto text-sm"
                        >
                          <Link href={href}>Ver detalle</Link>
                        </Button>
                        <WhatsAppCTA
                          template="Hola, me interesa {itemTitle} — {url}"
                          variables={{ itemTitle: o.title, url: "" }}
                          label="Consultar"
                          variant="secondary"
                          size="sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Destinos destacados</h2>
              <p className="text-sm text-muted-foreground">
                Inspírate con nuestra selección
              </p>
            </div>
          </div>
          {topDestinations.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aún no hay destinos destacados.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {topDestinations.map((d) => (
                <Card key={d.id} className="overflow-hidden">
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="group block"
                  >
                    <div className="relative h-28 w-full">
                      {d.heroImageUrl ? (
                        <Image
                          src={d.heroImageUrl}
                          alt={`${d.city}, ${d.country}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 640px) 50vw, 16vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <CardContent className="p-3 text-sm">
                      {d.city}, {d.country}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Departamentos</h2>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dep) => (
                <Card key={dep.id} className="overflow-hidden">
                  <Link
                    href={
                      dep.type === "WEDDINGS" ? "/weddings" : "/quinceanera"
                    }
                    className="group block"
                  >
                    <div className="relative h-36 w-full">
                      {dep.heroImageUrl ? (
                        <Image
                          src={dep.heroImageUrl}
                          alt={dep.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="font-medium">
                        {dep.type === "WEDDINGS"
                          ? "Bodas de destino"
                          : "Quinceañera"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dep.title}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Próximos eventos</h2>
              <p className="text-sm text-muted-foreground">
                Fechas y lugares destacados
              </p>
            </div>
          </div>
          {featuredEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay eventos próximos.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {featuredEvents.map((e) => (
                <Card key={e.id}>
                  <Link href={`/events/${e.slug}`} className="block p-4">
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Salidas fijas</h2>
              <p className="text-sm text-muted-foreground">
                Fechas y cupos limitados
              </p>
            </div>
          </div>
          {fixedDepartures.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay salidas fijas disponibles.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {fixedDepartures.map((fd) => (
                <Card key={fd.id}>
                  <Link
                    href={`/fixed-departures/${fd.slug}`}
                    className="block p-4"
                  >
                    <div className="font-medium">{fd.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(fd.startDate), "yyyy-MM-dd")} –{" "}
                      {format(new Date(fd.endDate), "yyyy-MM-dd")}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
        <SocialProof />
        <Features />
        <About />
        <Testimonials items={testimonials} />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
