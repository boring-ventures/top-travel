"use client";

import { useEffect, useState, useRef } from "react";
import { Globe, Plane, Calendar, Users } from "lucide-react";

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
}

const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
  shouldAnimate = false,
  delay = 0,
}: AnimatedCounterProps & { shouldAnimate?: boolean; delay?: number }) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (shouldAnimate && !isAnimating) {
      // Add a small delay for staggered animation effect
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

      // Easing function for smooth animation
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
      <span className="text-3xl font-semibold text-blue-600">
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
  // Stagger the animation delays for each card
  const delay = index * 200; // 200ms delay between each counter

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2">
        <AnimatedCounter
          end={metric.value}
          duration={2000}
          suffix={metric.suffix}
          shouldAnimate={isInView}
          delay={delay}
        />
      </div>

      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {metric.label}
      </h3>
    </div>
  );
};

// Custom hook for intersection observer
const useInView = (threshold = 0.3) => {
  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

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

export default function MetricsSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-16 bg-white"
      aria-label="Métricas de la empresa"
    >
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
    </section>
  );
}
