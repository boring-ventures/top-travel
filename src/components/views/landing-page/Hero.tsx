"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { ArrowRight, Sparkles, Music2, Heart, MapPin } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { ShineBorder } from "@/components/magicui/shine-border";
import { BlurFade } from "@/components/magicui/blur-fade";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Button } from "@/components/ui/button";

type HeroItem = { src: string; title: string; href: string; subtitle?: string };
type HeroProps = { items?: HeroItem[] };

export default function Hero({ items = [] }: HeroProps) {
  const featured = items[0];
  const isVideo = useMemo(() => {
    if (!featured?.src) return false;
    return /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(featured.src);
  }, [featured?.src]);
  return (
    <section
      className="relative overflow-hidden"
      aria-label="GABYTOPTRAVEL hero"
      role="region"
    >
      {/* Background media: single featured image or video */}
      <div className="absolute inset-0 -z-10">
        {featured ? (
          isVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={featured.title}
            >
              <source src={featured.src} />
            </video>
          ) : (
            <Image
              src={featured.src}
              alt={featured.title || "Hero"}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )
        ) : (
          <Image
            src="/window.svg"
            alt="Travel"
            fill
            className="object-cover opacity-40"
          />
        )}
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      </div>

      {/* Foreground content */}
      <div className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <ShineBorder className="p-8 rounded-2xl bg-background/60 backdrop-blur">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Floating badge */}
                <BlurFade>
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 px-6 py-2 mb-8 shadow-glow backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 text-primary mr-2" />
                    <SparklesText text="Agencia de viajes premium en Bolivia" />
                  </div>
                </BlurFade>

                <BoxReveal>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                    Viajes inolvidables, planificación experta
                    <br />
                    <span className="text-primary">
                      Weddings • Quinceañera • Eventos • Destinos
                    </span>
                  </h1>
                </BoxReveal>

                <BlurFade delay={0.2}>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                    Experiencias a medida con seguridad, logística y atención
                    personalizada. Escríbenos por WhatsApp.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                    <WhatsAppCTA
                      template="Hola, me interesa {itemTitle} — desde {url}"
                      variables={{ itemTitle: "GABYTOPTRAVEL", url: "" }}
                      label="Consultar por WhatsApp"
                      size="lg"
                    />
                    {featured ? (
                      <ShineBorder className="rounded-md">
                        <Link
                          href={featured.href}
                          className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          Ver: {featured.title}
                          <ArrowRight className="ml-2" size={20} />
                        </Link>
                      </ShineBorder>
                    ) : null}
                  </div>
                  {/* Quick niche links for fast discovery */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Link href="/events" aria-label="Conciertos y Eventos">
                        <Music2 className="h-4 w-4" aria-hidden="true" />
                        Conciertos y Eventos
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Link href="/weddings" aria-label="Bodas Destino">
                        <Heart className="h-4 w-4" aria-hidden="true" />
                        Bodas Destino
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Link href="/quinceanera" aria-label="Quinceañeras">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Quinceañeras
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Link href="/destinations" aria-label="Destinos Top">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        Destinos Top
                      </Link>
                    </Button>
                  </div>
                </BlurFade>
              </div>

              {/* Current slide caption */}
              {featured ? (
                <div className="mt-6 text-sm text-muted-foreground">
                  Destacado:{" "}
                  <span className="text-foreground font-medium">
                    {featured.title}
                  </span>
                </div>
              ) : null}

              {/* Stats section with enhanced styling */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
                {[
                  {
                    label: "Oficinas",
                    value: "Santa Cruz • Cochabamba • La Paz",
                  },
                  { label: "Experiencia", value: "+10 años" },
                  { label: "Satisfacción", value: "4.9/5" },
                ].map((stat, i) => (
                  <BlurFade
                    key={stat.label}
                    delay={i * 0.1}
                    className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </BlurFade>
                ))}
              </div>
            </ShineBorder>
          </div>
        </div>
      </div>
    </section>
  );
}
