import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Users,
  Sparkles,
  Building2,
  Globe,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { ShineBorder } from "@/components/magicui/shine-border";
import Link from "next/link";

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Contáctanos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Estamos Aquí para Ti
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Estamos aquí para ayudarte a planificar tu próxima aventura.
                Escríbenos por WhatsApp para cotizaciones, paquetes
                personalizados, eventos y más.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">Respuesta rápida</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Atención personalizada
                  </span>
                </div>
              </div>
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
                  {/* WhatsApp */}
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="p-3 sm:p-4 bg-green-100 dark:bg-green-900/20 rounded-xl">
                          <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg sm:text-xl mb-3 text-foreground">
                            WhatsApp
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            Nuestro canal principal de comunicación para
                            consultas rápidas y cotizaciones
                          </p>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-lg text-foreground">
                              {phone || "Disponible pronto"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </ShineBorder>

                  {/* Offices */}
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                          <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg sm:text-xl mb-3 text-foreground">
                            Nuestras Oficinas
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
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
                                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                              >
                                <Badge
                                  variant="outline"
                                  className="text-sm font-semibold"
                                >
                                  {office.city}
                                </Badge>
                                <div>
                                  <span className="text-sm font-medium text-foreground">
                                    {office.region}
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    {office.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </ShineBorder>

                  {/* Hours */}
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-6 sm:p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="p-3 sm:p-4 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg sm:text-xl mb-3 text-foreground">
                            Horarios de Atención
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            Estamos disponibles para ayudarte en estos horarios
                          </p>
                          <div className="space-y-2 text-sm sm:text-base">
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                              <span className="font-medium text-foreground">
                                Lunes - Viernes:
                              </span>
                              <span className="font-semibold text-primary">
                                8:00 AM - 6:00 PM
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                              <span className="font-medium text-foreground">
                                Sábados:
                              </span>
                              <span className="font-semibold text-primary">
                                9:00 AM - 2:00 PM
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                              <span className="font-medium text-foreground">
                                Domingos:
                              </span>
                              <span className="font-semibold text-muted-foreground">
                                Cerrado
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </ShineBorder>
                </div>
              </div>

              {/* Contact Form & CTA */}
              <div className="space-y-8 sm:space-y-12">
                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 sm:p-10 bg-transparent border-0 shadow-xl">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
                        ¿Cómo podemos ayudarte?
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Escríbenos por WhatsApp y te responderemos en minutos
                      </p>
                    </div>

                    <div className="space-y-6">
                      <WhatsAppCTA
                        template="Hola! Quiero más información sobre sus servicios de viajes."
                        variables={{}}
                        label="Chatear por WhatsApp"
                        size="lg"
                        className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 text-lg font-semibold"
                      />

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-6">
                          O consulta sobre servicios específicos:
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-10 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          >
                            Conciertos & Eventos
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-10 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          >
                            Destinos Top
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-10 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          >
                            Quinceañeras
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-10 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          >
                            Bodas de Destino
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ShineBorder>

                {/* Quick Info */}
                <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                  <Card className="p-6 sm:p-8 bg-transparent border-0 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                        <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h4 className="font-bold text-xl ml-3 text-foreground">
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
                          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-foreground">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </ShineBorder>

                {/* Additional CTA */}
                <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                  <Card className="p-6 sm:p-8 bg-transparent border-0 text-center">
                    <h4 className="font-bold text-xl mb-4 text-foreground">
                      ¿Necesitas ayuda urgente?
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      Para consultas urgentes, contáctanos directamente
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild variant="outline" className="border-2">
                        <Link href="/destinations">Explorar Destinos</Link>
                      </Button>
                      <Button asChild variant="outline" className="border-2">
                        <Link href="/packages">Ver Paquetes</Link>
                      </Button>
                    </div>
                  </Card>
                </ShineBorder>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
