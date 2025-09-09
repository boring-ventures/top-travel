"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Star,
  Award,
  Users,
  MapPin,
  Globe,
  Shield,
  Sparkles,
  Building2,
  Compass,
  ArrowRight,
} from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import Link from "next/link";

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
      description:
        "Cada viaje está diseñado específicamente para tus necesidades y preferencias únicas.",
      icon: Heart,
      color: "text-rose-500",
    },
    {
      title: "Pasión por el Servicio",
      description:
        "Nos apasiona crear experiencias inolvidables que superen todas tus expectativas.",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Calidad Premium",
      description:
        "Trabajamos solo con los mejores proveedores para garantizar la más alta calidad.",
      icon: Award,
      color: "text-blue-500",
    },
    {
      title: "Reconocimiento",
      description:
        "Más de 10 años de experiencia y miles de clientes satisfechos nos avalan.",
      icon: Users,
      color: "text-green-500",
    },
  ];

  const values = [
    {
      icon: Award,
      title: "Excelencia",
      description:
        "Comprometidos con la calidad en cada detalle de tu experiencia",
    },
    {
      icon: Users,
      title: "Confianza",
      description:
        "Construimos relaciones duraderas basadas en la transparencia",
    },
    {
      icon: Sparkles,
      title: "Innovación",
      description:
        "Siempre buscando nuevas formas de sorprender a nuestros clientes",
    },
  ];

  const offices = [
    {
      city: "Santa Cruz",
      region: "Centro",
      description: "Oficina principal",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      city: "Cochabamba",
      region: "Valle",
      description: "Sucursal estratégica",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    },
    {
      city: "La Paz",
      region: "Altiplano",
      description: "Punto de conexión",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const services = [
    {
      name: "Conciertos & Eventos",
      description: "Eventos exclusivos",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Destinos Top",
      description: "Experiencias únicas",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Quinceañeras",
      description: "Celebraciones especiales",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Bodas de Destino",
      description: "Momentos inolvidables",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <AnimatedHero
            title="Conoce"
            subtitle="de GabyTop Travel"
            description="Tu agencia de viajes de confianza en Bolivia, creando experiencias memorables desde 2020. Descubre nuestra historia, valores y servicios."
            animatedWords={[
              "Nuestra Historia",
              "Nuestros Valores",
              "Nuestros Servicios",
              "Nuestra Pasión",
              "Nuestro Compromiso",
            ]}
            backgroundImage="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80"
            animatedWordColor="text-wine"
            accentColor="bg-wine"
          />
        </section>

        {/* Search and Info Section */}
        <section className="bg-white py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">
              Descubre más sobre{" "}
              <span className="font-light italic">GabyTop Travel</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-wine/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-wine" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Oficinas</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Presencia en Santa Cruz, Cochabamba y La Paz
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-wine/10 rounded-lg">
                    <Award className="h-5 w-5 text-wine" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Experiencia</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Más de 10 años creando experiencias únicas
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-wine/10 rounded-lg">
                    <Heart className="h-5 w-5 text-wine" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Servicio</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Atención personalizada y de calidad premium
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir{" "}
                <span className="font-light italic">GabyTop Travel</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre las características que nos hacen únicos en el mercado
                de viajes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 transition-colors duration-300 group-hover:text-gray-900">
                        {feature.title}
                      </h3>
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

        {/* Values Section */}
        <section className="py-16 w-full bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestros <span className="font-light italic">Valores</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Los principios que guían cada experiencia que creamos
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 bg-wine/10 rounded-2xl">
                        <value.icon className="h-8 w-8 text-wine" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offices Section */}
        <section className="py-16 w-full bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestras <span className="font-light italic">Oficinas</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encuéntranos en las principales ciudades de Bolivia
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <div
                  key={office.city}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 bg-wine/10 rounded-2xl">
                        <Building2 className="h-8 w-8 text-wine" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {office.city}
                    </h3>
                    <p className="text-gray-600 mb-2">{office.region}</p>
                    <p className="text-sm text-gray-500">
                      {office.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 w-full bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestros <span className="font-light italic">Servicios</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experiencias únicas diseñadas especialmente para ti
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  className="relative overflow-hidden rounded-2xl group hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="space-y-2">
                        <h3 className="text-white text-lg font-bold drop-shadow-lg">
                          {service.name}
                        </h3>
                        <p className="text-white/90 text-sm drop-shadow-lg">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="py-16 w-full bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Nuestra Historia
              </h2>
              <div className="relative h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  alt="GabyTop Travel team"
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <p className="text-lg max-w-3xl mx-auto">
                      En GabyTop Travel, nuestra visión es ser la agencia de
                      viajes líder en Bolivia, conocida por crear experiencias
                      de viaje personalizadas e inolvidables. Nuestra misión es
                      proporcionar un servicio excepcional, orientación experta
                      y planificación de viajes sin problemas.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                GabyTop Travel SRL es tu agencia de viajes de confianza en
                Bolivia, con oficinas en Santa Cruz, Cochabamba y La Paz.
                Creamos experiencias memorables: desde conciertos y eventos
                exclusivos hasta destinos exóticos, viajes de quinceañera y
                bodas de destino.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <WhatsAppCTA
                  template="Hola! Quiero más información sobre GabyTop Travel."
                  variables={{}}
                  label="Chatear por WhatsApp"
                  size="default"
                  className="bg-wine text-white hover:bg-wine/90 border-0"
                />
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="border-2 border-gray-300 hover:border-gray-400"
                >
                  <Link href="/destinations">Ver Destinos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
