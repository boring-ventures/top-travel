import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedHero } from "@/components/ui/animated-hero";
import {
  MapPin,
  Clock,
  Users,
  Sparkles,
  Building2,
  Globe,
  Check,
  Phone,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <AnimatedHero
            title="Contáctanos para"
            subtitle=""
            description="Estamos aquí para ayudarte a crear experiencias únicas. Escríbenos por WhatsApp para cotizaciones, paquetes personalizados, eventos y más."
            animatedWords={[
              "Viajes",
              "Bodas",
              "Quinceañeras",
              "Eventos",
              "Sueños",
            ]}
            backgroundImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=compress&cs=tinysrgb&w=1920&q=80"
            animatedWordColor="text-wine"
            accentColor="bg-wine"
          />
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Información de{" "}
                <span className="font-light italic text-wine">Contacto</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nuestro equipo está disponible para ayudarte con cualquier
                consulta sobre viajes, eventos o paquetes personalizados.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
              {/* WhatsApp */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    WhatsApp
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Respuesta rápida y atención personalizada
                  </p>
                  <WhatsAppCTA
                    template="Hola! Quiero más información sobre sus servicios de viajes."
                    variables={{}}
                    label="Chatear por WhatsApp"
                    phone="+59169671000"
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  />
                </div>
              </Card>

              {/* Phone */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Teléfono
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    Lunes a Viernes: 8:30 AM - 6:30 PM
                  </p>
                  <Link
                    href="tel:+59175651451"
                    className="inline-block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 bg-gray-50 hover:bg-blue-50 px-4 py-2 rounded-lg"
                  >
                    +591 756 514 51
                  </Link>
                </div>
              </Card>
            </div>

            {/* Office Locations & Hours */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestras{" "}
                <span className="font-light italic text-wine">Oficinas</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Visítanos en cualquiera de nuestras ubicaciones estratégicas
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Office Locations - Left Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      city: "Santa Cruz",
                      address:
                        "Av. San Martín, Equipetrol Norte Calle F, Edificio Aquarius 7",
                      mapsLink: "https://maps.app.goo.gl/3CyKDKuUwj7GJ8Yf7",
                    },
                    {
                      city: "Santa Cruz",
                      address:
                        "3er Anillo Externo, Av. Marcelo Terceros, Esq. Salvador Pitare",
                      mapsLink: "https://maps.app.goo.gl/R88tDzsuBTFgR4M47",
                    },
                    {
                      city: "Cochabamba",
                      address: "Av. Gualberto Villarroel Esquina Av. Oblitas",
                      mapsLink: "https://maps.app.goo.gl/JfN5CKSx5rXgLCsm7",
                    },
                    {
                      city: "La Paz",
                      address:
                        "Av. José Ballivián, C/20 de Calacoto, Edificio Platinum #1487, Of.01",
                      mapsLink: "https://maps.app.goo.gl/BXcNshfLnZyXrkr3A",
                    },
                    {
                      city: "Oruro",
                      address:
                        "Calle Adolfo Mier 851, Cámara Departamental de Hotelería, Piso 1, Oficina 105",
                      mapsLink: "https://maps.app.goo.gl/hAZKKtJAbr8nRC2e6",
                    },
                  ].map((office, index) => (
                    <Card
                      key={`${office.city}-${index}`}
                      className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <MapPin className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              variant="outline"
                              className="text-sm font-semibold"
                            >
                              {office.city}
                            </Badge>
                          </div>
                          <Link
                            href={office.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-800 hover:text-blue-600 font-medium hover:underline transition-colors duration-200 block"
                          >
                            {office.address}
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Hours - Right Column */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 h-fit">
                <div className="text-center mb-6">
                  <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Horarios de Atención
                  </h3>
                  <p className="text-gray-600">
                    Estamos disponibles para ayudarte en estos horarios
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <span className="font-medium text-gray-900">
                      Lunes - Viernes:
                    </span>
                    <span className="font-bold text-lg text-gray-800">
                      8:30 AM - 6:30 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <span className="font-medium text-gray-900">Sábados:</span>
                    <span className="font-bold text-lg text-gray-800">
                      9:00 AM - 12:30 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                    <span className="font-medium text-gray-900">Domingos:</span>
                    <span className="font-bold text-lg text-red-600">
                      Cerrado
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir{" "}
                <span className="font-light italic text-wine">
                  Gaby Top Travel
                </span>
                ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <MessageCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Respuesta Rápida
                </h3>
                <p className="text-gray-600 text-sm">
                  Atención inmediata por WhatsApp y respuesta en minutos
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Paquetes Personalizados
                </h3>
                <p className="text-gray-600 text-sm">
                  Diseñamos experiencias únicas adaptadas a tus necesidades
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Globe className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Experiencia Global
                </h3>
                <p className="text-gray-600 text-sm">
                  Conocimiento local y conexiones internacionales
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Atención Personalizada
                </h3>
                <p className="text-gray-600 text-sm">
                  Un asesor dedicado para cada cliente y proyecto
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Precios Competitivos
                </h3>
                <p className="text-gray-600 text-sm">
                  Mejores tarifas gracias a nuestras alianzas estratégicas
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Building2 className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Logística Sin Estrés
                </h3>
                <p className="text-gray-600 text-sm">
                  Nos encargamos de todos los detalles para que solo disfrutes
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <MessageCircle className="h-16 w-16 text-wine" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Listo para Planificar tu{" "}
                <span className="font-light italic text-wine">
                  Próxima Aventura
                </span>
                ?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Contáctanos hoy para una consulta gratuita y déjanos ayudarte a
                crear la experiencia de viaje de tus sueños.
              </p>
              <div className="flex justify-center">
                <WhatsAppCTA
                  template="Hola, quiero una consulta gratuita para mi próximo viaje — {url}"
                  variables={{ url: "" }}
                  label="Consulta Gratuita"
                  phone="+59169671000"
                  size="lg"
                  className="h-14 px-8 bg-wine hover:bg-wine/90 text-white border-0 text-lg font-semibold rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
