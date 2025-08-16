"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { BlurFade } from "@/components/magicui/blur-fade";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isValidImageUrl } from "@/lib/utils";

type HeroItem = { src: string; title: string; href: string; subtitle?: string };
type HeroProps = { items?: HeroItem[] };

export default function Hero({ items = [] }: HeroProps) {
  const featured = items[0];
  const fallbackBackgrounds: { src: string; title: string }[] = [
    {
      src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80",
      title: "Beach paradise",
    },
    {
      src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
      title: "Iconic city",
    },
    {
      src: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=80",
      title: "Mountain adventure",
    },
  ];
  const monthIndex = new Date().getMonth() % fallbackBackgrounds.length;
  const defaultBackgroundSrc = fallbackBackgrounds[monthIndex].src;
  const heroBackgroundSrc = featured?.src && isValidImageUrl(featured.src) ? featured.src : defaultBackgroundSrc;
  const [backgroundSrc, setBackgroundSrc] = useState<string>(heroBackgroundSrc);

  useEffect(() => {
    const validSrc = heroBackgroundSrc && isValidImageUrl(heroBackgroundSrc) ? heroBackgroundSrc : defaultBackgroundSrc;
    setBackgroundSrc(validSrc);
  }, [heroBackgroundSrc, defaultBackgroundSrc]);

  const isVideo = useMemo(() => {
    if (!backgroundSrc) return false;
    return /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(backgroundSrc);
  }, [backgroundSrc]);

  const offerItem = items[1] || featured;
  const offerHref = offerItem?.href;
  const offerTitle =
    offerItem?.title || "Exclusive Offer: 20% Off on All-Inclusive Resorts";
  const offerSubtitle =
    offerItem?.subtitle ||
    "Book your dream vacation now and save on luxurious all-inclusive resorts. Limited time offer!";
  // Carousel removed for new layout

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Sección principal de GABYTOPTRAVEL"
      role="region"
    >
      {/* Background media: single featured image or video */}
      <div className="absolute inset-0 z-0">
        {backgroundSrc ? (
          isVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={featured?.title || "Hero background"}
              onError={() => setBackgroundSrc(defaultBackgroundSrc)}
            >
              <source src={backgroundSrc} />
            </video>
          ) : (
            <Image
              src={backgroundSrc}
              alt={featured?.title || "Hero"}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              onError={() => setBackgroundSrc(defaultBackgroundSrc)}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        {/* Overlays for readability (dark gradient, avoid washing out image) */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 pt-4 md:pt-6 pb-6 md:pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered hero content */}
          <div className="flex min-h-[60vh] md:min-h-[70vh] flex-col items-center justify-center gap-4 md:gap-6 text-center">
            <BlurFade>
              <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Tu próxima experiencia inolvidable empieza aquí.
              </h1>
            </BlurFade>
            <BlurFade delay={0.08}>
              <h2 className="text-white/90 text-sm md:text-base font-normal">
                Conciertos, Quinceañeras, Bodas y Destinos TOP
              </h2>
            </BlurFade>
            <BlurFade delay={0.16}>
              <WhatsAppCTA
                template="¡Hola! Me gustaría planear mi viaje — {url}"
                variables={{ url: "" }}
                label="Planifica tu viaje ahora"
                size="lg"
                className="rounded-full h-12 px-5"
              />
            </BlurFade>
          </div>

          {/* Offer highlight block (text-only, no image) */}
          <div className="py-4">
            <div className="rounded-xl bg-background/70 backdrop-blur p-4 xl:p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground border-primary/80">
                    Oferta especial
                  </Badge>
                </div>
                <p className="text-white text-lg md:text-xl font-bold leading-tight tracking-tight">
                  {offerTitle}
                </p>
                <div className="flex items-end gap-3 justify-between">
                  <p className="text-white/80 text-base">{offerSubtitle}</p>
                  {offerHref ? (
                    <Button asChild className="rounded-full h-8 px-4">
                      <Link href={offerHref}>Reservar ahora</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
