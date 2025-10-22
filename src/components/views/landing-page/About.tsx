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
  Crown,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
} from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
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

  const whyChooseUs = [
    {
      title: "Experiencia Comprobada",
      description:
        "Nuestra trayectoria en el sector nos respalda. Con más de +20 años de experiencia, hemos ayudado a miles de clientes a vivir experiencias únicas en los destinos más hermosos del mundo.",
      icon: Award,
      color: "text-wine",
    },
    {
      title: "Servicios Personalizados",
      description:
        "Entendemos que cada cliente es único, por eso ofrecemos servicios personalizados que se adaptan a tus deseos, necesidades y presupuesto.",
      icon: Heart,
      color: "text-wine",
    },
    {
      title: "Atención al Cliente",
      description:
        "Nuestro compromiso es tu satisfacción. Nos esforzamos por brindar un servicio cercano y atento, acompañándote en cada paso del proceso.",
      icon: Users,
      color: "text-wine",
    },
    {
      title: "Red de Proveedores Confiables",
      description:
        "Contamos con una red de proveedores de confianza que nos permite garantizar la más alta calidad en todos los aspectos de tu viaje o evento.",
      icon: Shield,
      color: "text-wine",
    },
    {
      title: "Soporte Integral",
      description:
        "Desde la planificación inicial hasta el regreso, nuestro equipo de expertos estará a tu lado para asegurarse de que todo salga perfecto.",
      icon: CheckCircle,
      color: "text-wine",
    },
  ];

  const testimonials = [
    {
      id: "about-1",
      authorName: "ETMO",
      location: null,
      rating: 5,
      content:
        "Querida Gaby y a todo su gran equipo, quiero agradecer de corazón por toda la paciencia y dedicación con todas las niñas. La experiencia de conocer el Viejo mundo a esta edad sin duda fue un sueño hecho realidad para ellas. No solo vuelven encantadas de tan bellos lugares que conocieron, sino sobre todo con la mente más abierta y la visión más clara para comerse el mundo! 31 niñas que se fueron conociendo en el camino en un viaje que pasó de ser extraordinario a ser inolvidable para ellas.",
    },
    {
      id: "about-2",
      authorName: "Camila Silva",
      location: null,
      rating: 5,
      content:
        "Optar por una boda en destino fue la mejor decisión que tomamos. Nuestra ceremonia en la playa de Cancún al atardecer fue mágica y llena de emociones. Gracias a Gaby Villegas, nuestra wedding planner Nahla Yusuf, y su equipo por hacer de nuestro día un reflejo perfecto de nuestro amor.",
    },
    {
      id: "about-3",
      authorName: "Bianka Uribe",
      location: null,
      rating: 5,
      content:
        "Querida Gabriela, no quiero que pase más el tiempo sin agradecerle por la hermosa boda que tuvo mi hija, la hemos pasado muy bien, tal vez mejor de lo que esperábamos, pero realmente la pasamos muy bien, fue una linda ceremonia unos días muy bendecidos para nuestra familia lo cual no tiene precio, a nombre mío y de mi esposo le hago llegar un agradecimiento sincero y especial sin antes valorar el trabajo de Carol que se hizo un gran trabajo y no se descuidó ni un minuto para que todo salga bien !!! Millón de gracias Gabriela. Definitivamente seguiré viajando con su agencia !!! Dios la bendiga siempre",
    },
    {
      id: "about-4",
      authorName: "Ponch",
      location: null,
      rating: 5,
      content:
        "MUCHAS GRACIAS Gaby por todo y más por traer a nuestros tesoros como dijo, sin un cabello menos ni uno más. Y por la confianza desde un principio cuando salieron de viaje la información oportuna nos dio la confianza de estar tranquilos.",
    },
    {
      id: "about-5",
      authorName: "Estefanía Maceda",
      location: null,
      rating: 5,
      content:
        "Estamos muy agradecidos con Gaby Top y su equipo por su eficiencia y compromiso. Aunque vivimos en La Paz y ellos operaban desde Santa Cruz, la coordinación fue impecable. Nos casamos en Cancún por la Iglesia Católica y fue una experiencia excepcional para nosotros y nuestros invitados. ¡Los recuerdos son inolvidables!",
    },
    {
      id: "about-6",
      authorName: "Sofia",
      location: null,
      rating: 5,
      content:
        "Yo le agradezco mucho por hacer realidad un principio mi sueño desde aquella vez que vi a su madre en el periódico hablando sobre los tours de 15 años luego ya fue el sueño de mis hijas recuerdo bien cuando me llamaron de Miami diciéndome mai queremos ir al tour de Europa También, gracias Sra. Gaby a usted y a todo su equipo.",
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
            subtitle="Gaby Top Travel"
            description="Tu agencia de viajes de confianza en Bolivia, creando experiencias memorables desde hace más de +20 años. Descubre nuestra historia, valores y servicios que nos convierten en líderes del turismo."
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

        {/* About Gaby Top Travel Section */}
        <section className="py-20 w-full bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Award className="w-4 h-4" />
                  Más de +20 años de experiencia
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-corporate-blue mb-6">
                  Sobre{" "}
                  <span className="text-wine relative">
                    Gaby Top Travel
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine/50 rounded-full"></div>
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Tu agencia de confianza para crear experiencias inolvidables
                  en Bolivia y el mundo
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-12 mb-20">
                {/* Mission Card */}
                <div>
                  <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 group h-full flex flex-col">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-wine/20 to-wine/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                        <Globe className="w-8 h-8 text-wine" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-corporate-blue mb-4 group-hover:text-wine transition-colors duration-300">
                          Nuestra Misión
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          <strong className="text-wine">Gaby Top Travel</strong>{" "}
                          es una agencia de viajes y turismo con reconocimiento
                          a nivel nacional e internacional, dedicada a ofrecer
                          experiencias excepcionales en cada rincón del mundo.
                          Nuestra misión es hacer realidad los viajes y eventos
                          más memorables y encantadores.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200/50 pt-6 mt-auto">
                      <p className="text-gray-600 leading-relaxed">
                        Transformamos sueños en realidades, creando momentos
                        únicos que perduran para siempre. Cada viaje es una
                        historia que contar, cada evento es una celebración que
                        recordar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience Card */}
                <div>
                  <div className="bg-gradient-to-br from-wine/10 via-white to-wine/5 border border-wine/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 group h-full flex flex-col">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-wine/20 to-wine/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                        <Award className="w-8 h-8 text-wine" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-corporate-blue mb-4 group-hover:text-wine transition-colors duration-300">
                          Nuestra Experiencia
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          Con más de{" "}
                          <strong className="text-wine">
                            +20 años de experiencia
                          </strong>{" "}
                          en la industria del turismo y la planificación de
                          eventos, hemos organizado innumerables viajes y
                          eventos exitosos.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-wine/20 pt-6 mt-auto">
                      <p className="text-gray-600 leading-relaxed">
                        Esta expertise nos permite ofrecer servicios que se
                        destacan por su profesionalismo y atención a los
                        detalles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Highlight */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-wine/10 to-wine/5 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-wine/5 via-wine/10 to-wine/5 border border-wine/20 rounded-3xl p-10 text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-wine/20 text-wine px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <Sparkles className="w-4 h-4" />
                      Nuestros Servicios
                    </div>
                    <h3 className="text-3xl font-bold text-corporate-blue mb-6">
                      Especialistas en Experiencias Únicas
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                      Desde conciertos y eventos exclusivos hasta destinos
                      exóticos, viajes de quinceañera y bodas de destino,
                      creamos experiencias únicas que van más allá de un simple
                      viaje. Cada proyecto es una obra maestra personalizada.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div className="bg-white/90 backdrop-blur-sm border border-wine/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      <Calendar className="w-8 h-8 text-wine mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-sm font-semibold text-corporate-blue">
                        Bodas de Destino
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm border border-wine/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      <Heart className="w-8 h-8 text-wine mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-sm font-semibold text-corporate-blue">
                        Quinceañeras
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm border border-wine/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      <Globe className="w-8 h-8 text-wine mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-sm font-semibold text-corporate-blue">
                        Viajes Familiares
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm border border-wine/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      <Sparkles className="w-8 h-8 text-wine mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-sm font-semibold text-corporate-blue">
                        Viajes de Lujo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-20 w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-corporate-blue mb-6">
                <span className="text-wine relative">
                  Fundadores
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Conoce a las personas que dieron vida a Gaby Top Travel
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="relative group mb-6">
                  <div className="absolute -inset-4 bg-gradient-to-r from-wine/20 to-wine/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative">
                    <Image
                      src="/images/team/founder2.png"
                      alt="Gabriela Villegas Suárez - Fundadora"
                      width={400}
                      height={500}
                      className="rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 w-full h-auto"
                    />
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-corporate-blue mb-2">
                    Gabriela Villegas Suárez
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-3 py-1 rounded-full text-sm font-semibold">
                    <Crown className="w-4 h-4" />
                    Fundadora
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="relative group mb-6">
                  <div className="absolute -inset-4 bg-gradient-to-r from-wine/20 to-wine/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative">
                    <Image
                      src="/images/team/founder1.png"
                      alt="Elias Belmonte Eguez - Fundador"
                      width={400}
                      height={500}
                      className="rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 w-full h-auto"
                    />
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-corporate-blue mb-2">
                    Elias Belmonte Eguez
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-3 py-1 rounded-full text-sm font-semibold">
                    <Crown className="w-4 h-4" />
                    Fundador
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Nuestras fortalezas
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-corporate-blue mb-6">
                ¿Por qué elegir{" "}
                <span className="text-wine relative">
                  Gaby Top Travel
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine/50 rounded-full"></div>
                </span>
                ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubre las razones que nos convierten en tu mejor opción para
                viajes y eventos
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-3 hover:border-wine/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-wine/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex flex-col items-center text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-wine/10 to-wine/5 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                        <IconComponent className={`w-10 h-10 ${item.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-corporate-blue mb-4 transition-colors duration-300 group-hover:text-wine">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 w-full bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                Conoce a nuestro equipo
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-corporate-blue mb-6">
                Nuestro{" "}
                <span className="text-wine relative">
                  equipo
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Contamos con un equipo profesional y listo para organizar tu
                viaje o evento perfecto
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-8 bg-gradient-to-r from-wine/20 to-wine/10 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
                <div className="relative">
                  <Image
                    src="/images/team/team.jpg"
                    alt="Equipo de Gaby Top Travel"
                    width={800}
                    height={600}
                    className="rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 w-full bg-gradient-to-br from-wine via-wine/95 to-wine relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-wine/90 via-wine to-wine/90 -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                ¡Comienza tu aventura hoy!
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Armemos juntos tu{" "}
                <span className="relative">
                  experiencia perfecta
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-white to-white/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Estamos listos para crear el viaje o evento de tus sueños. ¿Y
                tú? ¡Contáctanos y hagamos realidad tu próxima aventura!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <WhatsAppCTA
                  template="Hola! Quiero más información sobre los servicios de Gaby Top Travel."
                  variables={{}}
                  label="Solicitar información"
                  phone="+59177365655"
                  size="lg"
                  className="bg-white text-wine hover:bg-gray-50 border-0 text-lg font-semibold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-wine text-lg font-semibold px-10 py-5 rounded-2xl backdrop-blur-sm bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/destinations">Ver Destinos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Testimonios reales
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-corporate-blue mb-6">
                <span className="text-wine relative">
                  Testimonios
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Lo que dicen nuestros clientes sobre sus experiencias con Gaby
                Top Travel
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({
                      length: Math.max(0, Math.min(5, testimonial.rating ?? 5)),
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-wine"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">
                      {testimonial.authorName}
                    </div>
                    {testimonial.location && <div>{testimonial.location}</div>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 w-full bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Globe className="w-4 h-4" />
                Tu próxima aventura te espera
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-corporate-blue mb-8 leading-tight">
                En Gaby Top Travel, creemos que cada experiencia debe ser tan{" "}
                <span className="text-wine relative">
                  especial y única
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-wine to-wine/50 rounded-full"></div>
                </span>{" "}
                como tus sueños
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto">
                Permítenos ayudarte a crear recuerdos inolvidables en el destino
                de tus sueños, ya sea un viaje familiar, una boda de destino,
                una quinceañera o cualquier evento especial.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <WhatsAppCTA
                  template="Hola! Quiero más información sobre los servicios de Gaby Top Travel."
                  variables={{}}
                  label="Contactar por WhatsApp"
                  phone="+59177365655"
                  size="lg"
                  className="bg-wine text-white hover:bg-wine/90 border-0 text-lg font-semibold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-wine/20 transition-all duration-300 hover:scale-105"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-wine text-wine hover:bg-wine hover:text-white text-lg font-semibold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/contact">Contacto</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
