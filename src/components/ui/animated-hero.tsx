"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  animatedWords?: string[];
  backgroundImage?: string;
  animatedWordColor?: string;
  accentColor?: string;
}

function AnimatedHero({
  title = "Descubre las",
  subtitle = "del mundo",
  description = "Explora destinos increíbles, eventos únicos y experiencias inolvidables. Desde conciertos épicos hasta destinos paradisíacos.",
  animatedWords = [
    "Maravillas",
    "Aventuras",
    "Experiencias",
    "Sueños",
    "Momentos",
  ],
  backgroundImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80",
  animatedWordColor = "text-yellow-400",
  accentColor = "bg-blue-400",
}: AnimatedHeroProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);
  const words = useMemo(() => animatedWords, [animatedWords]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timeoutId = setTimeout(() => {
      if (titleNumber === words.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, words, isMounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Destinos del mundo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/50 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 ${accentColor}/20 rounded-full blur-3xl animate-pulse delay-1000`}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        {/* Wine accent elements */}
        <div
          className={`absolute top-20 right-20 w-4 h-4 ${accentColor} rounded-full opacity-60 animate-pulse delay-300`}
        ></div>
        <div
          className={`absolute bottom-32 right-1/4 w-2 h-2 ${accentColor} rounded-full opacity-40 animate-pulse delay-700`}
        ></div>
        <div
          className={`absolute top-1/3 left-20 w-3 h-3 ${accentColor} rounded-full opacity-50 animate-pulse delay-1000`}
        ></div>
      </div>

      <div className="container mx-auto relative z-10 h-full px-6 py-6">
        <div className="flex gap-6 h-full items-center justify-center flex-col">
          {/* Main Title with Animation */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-4xl tracking-tighter text-center font-bold text-white drop-shadow-2xl">
              <span className="block">{title}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    className={`absolute font-light italic ${animatedWordColor} drop-shadow-lg ${animatedWordColor === "text-white" ? "text-shadow-black-glow" : ""}`}
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block">{subtitle}</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-white max-w-3xl text-center drop-shadow-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
