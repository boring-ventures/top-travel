"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Search,
  MapPin,
  Tag,
  Package,
  Globe,
  Plane,
  Calendar,
  Users,
} from "lucide-react";

import { BlurFade } from "@/components/magicui/blur-fade";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { isValidImageUrl } from "@/lib/utils";

type HeroItem = { src: string; title: string; href: string; subtitle?: string };
type DatabaseTag = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  _count: {
    packageTags: number;
    destinationTags: number;
  };
};

type HeroProps = {
  items?: HeroItem[];
  tags?: DatabaseTag[];
};

interface Metric {
  id: string;
  value: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
}

const metrics: Metric[] = [
  {
    id: "countries",
    value: 30,
    label: "Países Destino",
    icon: <Globe className="h-8 w-8" />,
    suffix: "+",
  },
  {
    id: "trips",
    value: 10000,
    label: "Viajes Exitosos",
    icon: <Plane className="h-8 w-8" />,
    suffix: "+",
  },
  {
    id: "experience",
    value: 10,
    label: "Años de Experiencia",
    icon: <Calendar className="h-8 w-8" />,
    suffix: "+",
  },
  {
    id: "clients",
    value: 20000,
    label: "Clientes Satisfechos",
    icon: <Users className="h-8 w-8" />,
    suffix: "+",
  },
];

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  shouldAnimate?: boolean;
  delay?: number;
}

const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
  shouldAnimate = false,
  delay = 0,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (shouldAnimate && !isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, isAnimating, delay]);

  useEffect(() => {
    if (!isAnimating || typeof window === "undefined") return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isAnimating]);

  return (
    <div className="transition-all duration-300">
      <span className="text-lg font-semibold text-white">
        {suffix}
        {count.toLocaleString()}
      </span>
    </div>
  );
};

interface MetricCardProps {
  metric: Metric;
  isInView: boolean;
  index: number;
}

const MetricCard = ({ metric, isInView, index }: MetricCardProps) => {
  const delay = index * 200;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 text-white/80">{metric.icon}</div>
      <div className="mb-2">
        <AnimatedCounter
          end={metric.value}
          duration={2000}
          suffix={metric.suffix}
          shouldAnimate={isInView}
          delay={delay}
        />
      </div>
      <h3 className="text-[10px] font-medium text-white/80 uppercase tracking-wide">
        {metric.label}
      </h3>
    </div>
  );
};

const useInView = (threshold = 0.3) => {
  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setInView(true);
          setHasTriggered(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasTriggered]);

  return { ref, inView };
};

export default function Hero({ items = [], tags = [] }: HeroProps) {
  const featured = items[0];
  const { ref: metricsRef, inView } = useInView(0.1);

  // Use a simple gradient background as fallback instead of external images
  const fallbackBackgrounds: { src: string; title: string }[] = [
    {
      src: "/api/placeholder/1600/900",
      title: "Travel destination",
    },
  ];
  const [defaultBackgroundSrc, setDefaultBackgroundSrc] = useState(
    fallbackBackgrounds[0].src
  );

  // Set month-based background on client side only
  useEffect(() => {
    const monthIndex = new Date().getMonth() % fallbackBackgrounds.length;
    setDefaultBackgroundSrc(fallbackBackgrounds[monthIndex].src);
  }, []);

  const heroBackgroundSrc =
    featured?.src && isValidImageUrl(featured.src)
      ? featured.src
      : defaultBackgroundSrc;
  const [backgroundSrc, setBackgroundSrc] = useState<string>(heroBackgroundSrc);

  useEffect(() => {
    const validSrc =
      heroBackgroundSrc && isValidImageUrl(heroBackgroundSrc)
        ? heroBackgroundSrc
        : defaultBackgroundSrc;
    setBackgroundSrc(validSrc);
  }, [heroBackgroundSrc, defaultBackgroundSrc]);

  const isVideo = useMemo(() => {
    if (!backgroundSrc) return false;
    return /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(backgroundSrc);
  }, [backgroundSrc]);

  // Función para obtener el ícono según el tipo de etiqueta
  const getTagIcon = (type: string, name: string) => {
    const lowerName = name.toLowerCase();

    // Mapeo de tipos de etiqueta a íconos
    if (type === "THEME") {
      if (
        lowerName.includes("aventura") ||
        lowerName.includes("trekking") ||
        lowerName.includes("montaña")
      ) {
        return <MapPin className="h-3 w-3 text-emerald-400" />;
      }
      if (
        lowerName.includes("playa") ||
        lowerName.includes("costa") ||
        lowerName.includes("mar")
      ) {
        return <MapPin className="h-3 w-3 text-cyan-400" />;
      }
      if (
        lowerName.includes("naturaleza") ||
        lowerName.includes("eco") ||
        lowerName.includes("parque")
      ) {
        return <MapPin className="h-3 w-3 text-green-400" />;
      }
      if (
        lowerName.includes("ciudad") ||
        lowerName.includes("urbano") ||
        lowerName.includes("metropolitano")
      ) {
        return <MapPin className="h-3 w-3 text-blue-400" />;
      }
      if (
        lowerName.includes("gastronomía") ||
        lowerName.includes("comida") ||
        lowerName.includes("culinario")
      ) {
        return <MapPin className="h-3 w-3 text-orange-400" />;
      }
      if (
        lowerName.includes("fotografía") ||
        lowerName.includes("foto") ||
        lowerName.includes("paisaje")
      ) {
        return <MapPin className="h-3 w-3 text-purple-400" />;
      }
      if (
        lowerName.includes("cultura") ||
        lowerName.includes("tradición") ||
        lowerName.includes("arte")
      ) {
        return <MapPin className="h-3 w-3 text-pink-400" />;
      }
      if (
        lowerName.includes("compras") ||
        lowerName.includes("shopping") ||
        lowerName.includes("artesanía")
      ) {
        return <MapPin className="h-3 w-3 text-red-400" />;
      }
      if (
        lowerName.includes("relax") ||
        lowerName.includes("spa") ||
        lowerName.includes("bienestar")
      ) {
        return <MapPin className="h-3 w-3 text-amber-400" />;
      }
    }

    // Íconos por defecto según el tipo
    switch (type) {
      case "REGION":
        return <MapPin className="h-3 w-3 text-blue-400" />;
      case "THEME":
        return <Tag className="h-3 w-3 text-green-400" />;
      case "DEPARTMENT":
        return <Package className="h-3 w-3 text-purple-400" />;
      default:
        return <Tag className="h-3 w-3 text-gray-400" />;
    }
  };

  // Función para obtener el color según el tipo
  const getTagColor = (type: string) => {
    switch (type) {
      case "REGION":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30";
      case "THEME":
        return "bg-green-500/20 text-green-200 border-green-400/30";
      case "DEPARTMENT":
        return "bg-purple-500/20 text-purple-200 border-purple-400/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-400/30";
    }
  };

  return (
    <section
      className="relative overflow-hidden -mt-16 sm:-mt-20"
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
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/60" />
      </div>

      {/* Foreground content */}
      <div
        className="relative z-10 h-[120vh] flex items-center justify-center"
        style={{ isolation: "isolate" }}
      >
        <div className="w-full mx-auto px-0">
          {/* Hero content - centered vertically and horizontally */}
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 text-center">
            {/* Main title */}
            <BlurFade>
              <div className="flex flex-col gap-2 text-center px-4">
                <h1
                  className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-[-0.033em] drop-shadow-lg uppercase"
                  style={{
                    fontFamily: "HomepageBaukasten-Bold",
                    fontWeight: "900",
                  }}
                >
                  <div>
                    TU VIAJE <span className="text-blue-700">SOÑADO</span>
                  </div>
                  <div>EMPIEZA AQUÍ</div>
                </h1>
              </div>
            </BlurFade>

            {/* Action Search Bar - Full width */}
            <BlurFade delay={0.08}>
              <div
                className="w-full"
                style={{
                  width: "60vw",
                  marginLeft: "calc(-30vw + 50%)",
                  marginRight: "calc(-30vw + 50%)",
                }}
              >
                <ActionSearchBar
                  placeholder="¿A dónde vas?"
                  className="w-full"
                />
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Metrics Section at the bottom of hero */}
        <div ref={metricsRef} className="absolute bottom-8 left-0 right-0 z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  isInView={inView}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
