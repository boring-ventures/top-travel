"use client";

import React from "react";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

const companies = [
  { name: "TechCorp", logo: "/logos/techcorp.svg" },
  { name: "InnovateLabs", logo: "/logos/innovatelabs.svg" },
  { name: "MindfulCo", logo: "/logos/mindfulco.svg" },
  { name: "FutureWorks", logo: "/logos/futureworks.svg" },
  { name: "ZenithHealth", logo: "/logos/zenithhealth.svg" },
];

export default function SocialProof() {
  const controls = useAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length);
    }, 3000); // Change company every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 1, 0],
      y: [20, 0, 0, -20],
      transition: { duration: 2.5, times: [0, 0.1, 0.9, 1] },
    });
  }, [controls]);

  return (
    <section className="py-12 sm:py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-6 sm:mb-8">
          Marcas que confían
        </h2>
        <div className="flex justify-center items-center h-20 sm:h-24">
          <motion.div
            key={currentIndex}
            animate={controls}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 sm:w-40 h-8 sm:h-10 mb-1 sm:mb-2">
              <Image
                src={companies[currentIndex].logo}
                alt={`${companies[currentIndex].name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 128px, 160px"
                priority
              />
            </div>
            <span className="text-base sm:text-lg font-semibold text-foreground">
              {companies[currentIndex].name}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
