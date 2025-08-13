"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { ShineBorder } from "@/components/magicui/shine-border";
import { BlurFade } from "@/components/magicui/blur-fade";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";

type HeroItem = { src: string; title: string; href: string; subtitle?: string };
type HeroProps = { items?: HeroItem[] };

export default function Hero({ items = [] }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => clearInterval(id);
  }, [items.length]);
  const current = items[index];
  return (
    <section className="relative overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-transparent to-transparent" />
        {items.length > 0 ? (
          items.slice(0, 6).map((it, i) => (
            <motion.div
              key={`${it.src}-${i}`}
              className="absolute inset-0"
              initial={{ opacity: i === 0 ? 1 : 0 }}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Image
                src={it.src}
                alt={it.title || "Hero"}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
            </motion.div>
          ))
        ) : (
          <div className="absolute inset-0">
            <Image
              src="/window.svg"
              alt="Travel"
              fill
              className="object-cover opacity-40"
            />
          </div>
        )}
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
                    {current ? (
                      <ShineBorder className="rounded-md">
                        <Link
                          href={current.href}
                          className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          Ver: {current.title}
                          <ArrowRight className="ml-2" size={20} />
                        </Link>
                      </ShineBorder>
                    ) : null}
                  </div>
                </BlurFade>
              </div>

              {/* Current slide caption */}
              {current ? (
                <div className="mt-6 text-sm text-muted-foreground">
                  Destacado:{" "}
                  <span className="text-foreground font-medium">
                    {current.title}
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
