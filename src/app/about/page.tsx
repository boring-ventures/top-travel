import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Award, Heart, Globe, Star } from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
  });

  const hasContent = page && page.status === "PUBLISHED" && page.sectionsJson;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Sobre GabyTop Travel
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Tu agencia de viajes de confianza en Bolivia, creando
                experiencias memorables desde 2020
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {hasContent ? (
              <Card className="p-8">
                <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-6 rounded-lg border overflow-auto">
                  {JSON.stringify(page?.sectionsJson, null, 2)}
                </pre>
              </Card>
            ) : (
              <div className="space-y-12">
                {/* Company Overview */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    GabyTop Travel SRL es tu agencia de viajes de confianza en
                    Bolivia, con oficinas en Santa Cruz, Cochabamba y La Paz.
                    Creamos experiencias memorables: desde conciertos y eventos
                    exclusivos hasta destinos exóticos, viajes de quinceañera y
                    bodas de destino.
                  </p>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6 text-center">
                    <div className="mb-4">
                      <Globe className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-3">Visión</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Ser la agencia líder en Bolivia, reconocida por innovación
                      y presencia nacional. Socio preferido para experiencias
                      únicas alrededor del mundo.
                    </p>
                  </Card>

                  <Card className="p-6 text-center">
                    <div className="mb-4">
                      <Heart className="h-12 w-12 mx-auto text-red-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-3">Misión</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Brindar un servicio excepcional, seguro y personalizado
                      para convertir cada viaje en un recuerdo inolvidable.
                    </p>
                  </Card>
                </div>

                {/* Values */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-8">Nuestros Valores</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <Award className="h-8 w-8 mx-auto text-yellow-600 mb-4" />
                      <h3 className="font-semibold mb-2">Excelencia</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprometidos con la calidad en cada detalle de tu
                        experiencia
                      </p>
                    </Card>
                    <Card className="p-6">
                      <Users className="h-8 w-8 mx-auto text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Confianza</h3>
                      <p className="text-sm text-muted-foreground">
                        Construimos relaciones duraderas basadas en la
                        transparencia
                      </p>
                    </Card>
                    <Card className="p-6">
                      <Star className="h-8 w-8 mx-auto text-purple-600 mb-4" />
                      <h3 className="font-semibold mb-2">Innovación</h3>
                      <p className="text-sm text-muted-foreground">
                        Siempre buscando nuevas formas de sorprender a nuestros
                        clientes
                      </p>
                    </Card>
                  </div>
                </div>

                {/* Offices */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-8">Nuestras Oficinas</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { city: "Santa Cruz", region: "Centro" },
                      { city: "Cochabamba", region: "Valle" },
                      { city: "La Paz", region: "Altiplano" },
                    ].map((office) => (
                      <Card key={office.city} className="p-6">
                        <MapPin className="h-8 w-8 mx-auto text-green-600 mb-4" />
                        <h3 className="font-semibold mb-2">{office.city}</h3>
                        <p className="text-sm text-muted-foreground">
                          {office.region}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-8">
                    Nuestros Servicios
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "Conciertos & Eventos", icon: "🎵" },
                      { name: "Destinos Top", icon: "🌍" },
                      { name: "Quinceañeras", icon: "👑" },
                      { name: "Bodas de Destino", icon: "💒" },
                    ].map((service) => (
                      <Card key={service.name} className="p-4 text-center">
                        <div className="text-2xl mb-2">{service.icon}</div>
                        <h3 className="font-semibold text-sm">
                          {service.name}
                        </h3>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <Card className="p-8 text-center bg-gradient-to-r from-orange-50 to-red-50">
                  <h2 className="text-2xl font-bold mb-4">
                    ¿Listo para tu próxima aventura?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Contáctanos hoy y descubre cómo podemos hacer de tu viaje
                    una experiencia inolvidable
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <WhatsAppCTA
                      template="Hola! Quiero más información sobre GabyTop Travel."
                      variables={{}}
                      label="Chatear por WhatsApp"
                      size="lg"
                    />
                    <Button variant="outline" size="lg">
                      Ver Destinos
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
