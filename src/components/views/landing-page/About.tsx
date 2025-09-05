"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Star, Award, Users, MapPin, Globe, Shield, Sparkles } from "lucide-react";

export default function About() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const features = [
    {
      title: "Experiencia Personalizada",
      description: "Cada viaje está diseñado específicamente para tus necesidades y preferencias únicas.",
      icon: Heart,
      color: "text-rose-500",
    },
    {
      title: "Pasión por el Servicio",
      description: "Nos apasiona crear experiencias inolvidables que superen todas tus expectativas.",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Calidad Premium",
      description: "Trabajamos solo con los mejores proveedores para garantizar la más alta calidad.",
      icon: Award,
      color: "text-blue-500",
    },
    {
      title: "Reconocimiento",
      description: "Más de 10 años de experiencia y miles de clientes satisfechos nos avalan.",
      icon: Users,
      color: "text-green-500",
    },
  ];

  return (
    <section className="py-12 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Sobre <span className="font-light italic">Nosotros</span></h1>
          </div>
        </div>

        <div className="mb-16">
          <div className="relative h-96 rounded-xl overflow-hidden">
            <Image
              alt="Paisaje de viaje"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs4QFf4DMIak3jOnSkKmpzkGJdUNtTa9Pt5v1q4BSpuW5Qe4jB16xER7dIoA6HzcdM95ONpByMdtPCYTuo7cLHjo22899w4t9DNGwgkMRwVOy6D9OeY7rIB420JOOLevz2krGuWj3r6kPZXl9bYsvNPiFwKGdsVyKVM6FAHPC_8KP6IOLko8UYkxidO-sT-DoY0vx5Id-5s7ngQI2B35ZjiIC8WyB4ZUhIbhsrEd1aJKh41VPgRbn89pIJu6ev_iiIDtDslfCV6tc"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <header className="text-center text-white p-4">
                <p className="mt-4 text-lg max-w-3xl mx-auto">
                  En GabyTop Travel, nuestra visión es ser la agencia de viajes líder en Bolivia, conocida por crear experiencias de viaje personalizadas e inolvidables. Nuestra misión es proporcionar un servicio excepcional, orientación experta y planificación de viajes sin problemas. Gaby, nuestra experta en viajes con experiencia, se dedica a crear tu viaje perfecto, asegurando que cada detalle esté adaptado a tus preferencias.
                </p>
              </header>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group relative bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 hover:border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden">
                {/* Glass Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon with Glass Effect */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl backdrop-blur-sm border border-white/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4 transition-colors duration-300 group-hover:text-gray-900">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
