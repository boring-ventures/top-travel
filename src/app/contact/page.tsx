import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  Sparkles,
  Building2,
  Globe,
  Check,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { ShineBorder } from "@/components/magicui/shine-border";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
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
              alt="Contacto GabyTop Travel"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Contáctanos
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Estamos aquí para ayudarte a planificar tu próxima aventura. Escríbenos por WhatsApp para cotizaciones, paquetes personalizados, eventos y más.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
              {/* Contact Details */}
              <div className="space-y-8 sm:space-y-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                    Información de Contacto
                  </h2>
                  <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                    Nuestro equipo está disponible para ayudarte con cualquier
                    consulta sobre viajes, eventos o paquetes personalizados.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {/* Offices */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 bg-gray-100 rounded-xl">
                        <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-900">
                          Nuestras Oficinas
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          Visítanos en cualquiera de nuestras ubicaciones
                          estratégicas
                        </p>
                        <div className="space-y-3">
                          {[
                            {
                              city: "Santa Cruz",
                              region: "Centro de Bolivia",
                              description: "Oficina principal",
                            },
                            {
                              city: "Cochabamba",
                              region: "Valle de Bolivia",
                              description: "Sucursal estratégica",
                            },
                            {
                              city: "La Paz",
                              region: "Altiplano de Bolivia",
                              description: "Punto de conexión",
                            },
                          ].map((office) => (
                            <div
                              key={office.city}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <Badge
                                variant="outline"
                                className="text-sm font-semibold"
                              >
                                {office.city}
                              </Badge>
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {office.region}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {office.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 bg-gray-100 rounded-xl">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-900">
                          Horarios de Atención
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          Estamos disponibles para ayudarte en estos horarios
                        </p>
                        <div className="space-y-2 text-sm sm:text-base">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">
                              Lunes - Viernes:
                            </span>
                            <span className="font-semibold text-gray-700">
                              8:00 AM - 6:00 PM
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">
                              Sábados:
                            </span>
                            <span className="font-semibold text-gray-700">
                              9:00 AM - 2:00 PM
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">
                              Domingos:
                            </span>
                            <span className="font-semibold text-gray-500">
                              Cerrado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form & CTA */}
              <div className="space-y-8 sm:space-y-12">
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                      ¿Cómo podemos ayudarte?
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Escríbenos por WhatsApp y te responderemos en minutos
                    </p>
                  </div>

                  <div className="space-y-6">
                    <WhatsAppCTA
                      template="Hola! Quiero más información sobre sus servicios de viajes."
                      variables={{}}
                      label="Chatear por WhatsApp"
                      size="lg"
                      className="w-full h-14 bg-black hover:bg-gray-800 text-white border-0 text-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Sparkles className="h-6 w-6 text-gray-700" />
                    </div>
                    <h4 className="font-bold text-xl ml-3 text-gray-900">
                      ¿Por qué elegirnos?
                    </h4>
                  </div>
                  <div className="space-y-4 text-sm sm:text-base">
                    {[
                      "Respuesta rápida en WhatsApp",
                      "Paquetes personalizados",
                      "Experiencia en Bolivia y el mundo",
                      "Atención personalizada",
                      "Precios competitivos",
                      "Logística sin estrés",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="p-1 bg-green-100 rounded-full flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
