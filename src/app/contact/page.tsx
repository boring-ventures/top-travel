import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, MessageCircle, Users } from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contáctanos
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Estamos aquí para ayudarte a planificar tu próxima aventura.
                Escríbenos por WhatsApp para cotizaciones, paquetes
                personalizados, eventos y más.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Información de Contacto
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Nuestro equipo está disponible para ayudarte con cualquier
                    consulta sobre viajes, eventos o paquetes personalizados.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* WhatsApp */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">WhatsApp</h3>
                        <p className="text-muted-foreground mb-3">
                          Nuestro canal principal de comunicación
                        </p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {phone || "Disponible pronto"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Offices */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          Nuestras Oficinas
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          Visítanos en cualquiera de nuestras ubicaciones
                        </p>
                        <div className="space-y-2">
                          {[
                            { city: "Santa Cruz", region: "Centro de Bolivia" },
                            { city: "Cochabamba", region: "Valle de Bolivia" },
                            { city: "La Paz", region: "Altiplano de Bolivia" },
                          ].map((office) => (
                            <div
                              key={office.city}
                              className="flex items-center gap-2"
                            >
                              <Badge variant="outline" className="text-xs">
                                {office.city}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {office.region}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Hours */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          Horarios de Atención
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          Estamos disponibles para ayudarte
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Lunes - Viernes:</span>
                            <span className="font-medium">
                              8:00 AM - 6:00 PM
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sábados:</span>
                            <span className="font-medium">
                              9:00 AM - 2:00 PM
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Domingos:</span>
                            <span className="font-medium">Cerrado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Contact Form & CTA */}
              <div className="space-y-8">
                <Card className="p-8">
                  <div className="text-center mb-8">
                    <div className="p-4 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
                      <Users className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      ¿Cómo podemos ayudarte?
                    </h3>
                    <p className="text-muted-foreground">
                      Escríbenos por WhatsApp y te responderemos en minutos
                    </p>
                  </div>

                  <div className="space-y-6">
                    <WhatsAppCTA
                      template="Hola! Quiero más información sobre sus servicios de viajes."
                      variables={{}}
                      label="Chatear por WhatsApp"
                      size="lg"
                      className="w-full"
                    />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        O consulta sobre servicios específicos:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="text-xs">
                          Conciertos & Eventos
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Destinos Top
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Quinceañeras
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Bodas de Destino
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Info */}
                <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <h4 className="font-semibold mb-4">¿Por qué elegirnos?</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span>Respuesta rápida en WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span>Paquetes personalizados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span>Experiencia en Bolivia y el mundo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span>Atención personalizada</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
