"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  Heart,
  Globe,
  Sparkles,
  Building2,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Title Section */}
        <section className="relative py-32 w-full overflow-hidden min-h-[100vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=compress&cs=tinysrgb&w=1200&q=80"
              alt="GabyTop Travel team"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Sobre <span className="font-light italic">GabyTop Travel</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Tu agencia de viajes de confianza en Bolivia, creando experiencias memorables desde 2020
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-16 sm:space-y-20">
              {/* Company Overview */}
              <motion.div 
                className="text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-bold mb-8 text-gray-900">
                  Nuestra Historia
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  GabyTop Travel SRL es tu agencia de viajes de confianza en Bolivia, con oficinas en Santa Cruz, Cochabamba y La Paz. Creamos experiencias memorables: desde conciertos y eventos exclusivos hasta destinos exóticos, viajes de quinceañera y bodas de destino.
                </p>
              </motion.div>

              {/* Vision & Mission */}
              <motion.div 
                className="grid md:grid-cols-2 gap-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <motion.div 
                  className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Globe className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Visión
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Ser la agencia líder en Bolivia, reconocida por innovación y presencia nacional. Socio preferido para experiencias únicas alrededor del mundo.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Heart className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Misión
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Brindar un servicio excepcional, seguro y personalizado para convertir cada viaje en un recuerdo inolvidable.
                  </p>
                </motion.div>
              </motion.div>

              {/* Values */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-12">
                  Nuestros Valores
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Award,
                      title: "Excelencia",
                      description: "Comprometidos con la calidad en cada detalle de tu experiencia"
                    },
                    {
                      icon: Users,
                      title: "Confianza",
                      description: "Construimos relaciones duraderas basadas en la transparencia"
                    },
                    {
                      icon: Sparkles,
                      title: "Innovación",
                      description: "Siempre buscando nuevas formas de sorprender a nuestros clientes"
                    }
                  ].map((value, index) => (
                    <motion.div 
                      key={value.title}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.8 + (index * 0.1),
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <value.icon className="h-6 w-6 text-gray-700" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Offices */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-12">
                  Nuestras Oficinas
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      city: "Santa Cruz",
                      region: "Centro",
                      description: "Oficina principal",
                    },
                    {
                      city: "Cochabamba",
                      region: "Valle",
                      description: "Sucursal estratégica",
                    },
                    {
                      city: "La Paz",
                      region: "Altiplano",
                      description: "Punto de conexión",
                    },
                  ].map((office, index) => (
                    <motion.div 
                      key={office.city} 
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.2 + (index * 0.1),
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <Building2 className="h-6 w-6 text-gray-700" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {office.city}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {office.region}
                      </p>
                      <p className="text-sm text-gray-500">
                        {office.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Services */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-12">
                  Nuestros Servicios
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Conciertos & Eventos",
                      description: "Eventos exclusivos",
                      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80"
                    },
                    {
                      name: "Destinos Top",
                      description: "Experiencias únicas",
                      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
                    },
                    {
                      name: "Quinceañeras",
                      description: "Celebraciones especiales",
                      image: "https://images.pexels.com/photos/33751500/pexels-photo-33751500.jpeg"
                    },
                    {
                      name: "Bodas de Destino",
                      description: "Momentos inolvidables",
                      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80"
                    },
                  ].map((service, index) => (
                    <motion.div 
                      key={service.name} 
                      className="relative overflow-hidden rounded-2xl group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.6 + (index * 0.1),
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                    >
                      <div className="relative h-64 w-full">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="space-y-3">
                            <h3 className="text-white text-xl font-bold drop-shadow-lg">
                              {service.name}
                            </h3>
                            <p className="text-white/90 text-sm drop-shadow-lg">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div 
                className="bg-gray-50 rounded-lg p-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
              >
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    ¿Listo para tu próxima aventura?
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Contáctanos hoy y descubre cómo podemos hacer de tu viaje una experiencia inolvidable
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <WhatsAppCTA
                        template="Hola! Quiero más información sobre GabyTop Travel."
                        variables={{}}
                        label="Chatear por WhatsApp"
                        size="lg"
                        className="bg-black text-white hover:bg-gray-800 border-0"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 hover:border-gray-400"
                      >
                        <Link href="/destinations">Ver Destinos</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
