"use client";

import { Users, Heart, Star, Award } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Experiencia Personalizada",
      description:
        "Cada viaje está diseñado específicamente para tus necesidades y preferencias únicas.",
    },
    {
      icon: <Heart className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Pasión por el Servicio",
      description:
        "Nos apasiona crear experiencias inolvidables que superen todas tus expectativas.",
    },
    {
      icon: <Star className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Calidad Premium",
      description:
        "Trabajamos solo con los mejores proveedores para garantizar la más alta calidad.",
    },
    {
      icon: <Award className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Reconocimiento",
      description:
        "Más de 10 años de experiencia y miles de clientes satisfechos nos avalan.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-foreground text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] pb-4 sm:pb-6">
            Sobre Nosotros
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed pb-8 sm:pb-12 max-w-3xl mx-auto">
            En GabyTop Travel, nuestra visión es ser la agencia de viajes líder
            en Bolivia, conocida por crear experiencias de viaje personalizadas
            e inolvidables. Nuestra misión es proporcionar un servicio
            excepcional, orientación experta y planificación de viajes sin
            problemas. Gaby, nuestra experta en viajes con experiencia, se
            dedica a crear tu viaje perfecto, asegurando que cada detalle esté
            adaptado a tus preferencias.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-foreground text-base sm:text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-border">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">
                10+
              </div>
              <div className="text-muted-foreground text-sm sm:text-base">
                Años de Experiencia
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">
                1000+
              </div>
              <div className="text-muted-foreground text-sm sm:text-base">
                Clientes Satisfechos
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">
                50+
              </div>
              <div className="text-muted-foreground text-sm sm:text-base">
                Destinos Únicos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
