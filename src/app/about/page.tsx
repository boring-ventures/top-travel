import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Award,
  Heart,
  Globe,
  Star,
  Sparkles,
  Compass,
  Building2,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { ShineBorder } from "@/components/magicui/shine-border";
import Link from "next/link";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
  });

  const hasContent = page && page.status === "PUBLISHED" && page.sectionsJson;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative pt-16 sm:pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-rose-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Sobre GabyTop Travel
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Tu Agencia de Confianza
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Tu agencia de viajes de confianza en Bolivia, creando
                experiencias memorables desde 2020
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Más de 3 años de experiencia
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Miles de clientes satisfechos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            {hasContent ? (
              <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                <Card className="p-8 bg-transparent border-0 shadow-xl">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-6 rounded-lg border overflow-auto text-foreground">
                    {JSON.stringify(page?.sectionsJson, null, 2)}
                  </pre>
                </Card>
              </ShineBorder>
            ) : (
              <div className="space-y-16 sm:space-y-20">
                {/* Company Overview */}
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                    Nuestra Historia
                  </h2>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                    GabyTop Travel SRL es tu agencia de viajes de confianza en
                    Bolivia, con oficinas en Santa Cruz, Cochabamba y La Paz.
                    Creamos experiencias memorables: desde conciertos y eventos
                    exclusivos hasta destinos exóticos, viajes de quinceañera y
                    bodas de destino.
                  </p>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                  <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                    <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                            <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-foreground">
                          Visión
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                        Ser la agencia líder en Bolivia, reconocida por
                        innovación y presencia nacional. Socio preferido para
                        experiencias únicas alrededor del mundo.
                      </p>
                    </Card>
                  </ShineBorder>

                  <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                    <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-foreground">
                          Misión
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                        Brindar un servicio excepcional, seguro y personalizado
                        para convertir cada viaje en un recuerdo inolvidable.
                      </p>
                    </Card>
                  </ShineBorder>
                </div>

                {/* Values */}
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                    Nuestros Valores
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                    <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                      <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                            <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">
                          Excelencia
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Comprometidos con la calidad en cada detalle de tu
                          experiencia
                        </p>
                      </Card>
                    </ShineBorder>
                    <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                      <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">
                          Confianza
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Construimos relaciones duraderas basadas en la
                          transparencia
                        </p>
                      </Card>
                    </ShineBorder>
                    <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                      <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">
                          Innovación
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Siempre buscando nuevas formas de sorprender a
                          nuestros clientes
                        </p>
                      </Card>
                    </ShineBorder>
                  </div>
                </div>

                {/* Offices */}
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                    Nuestras Oficinas
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
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
                    ].map((office) => (
                      <ShineBorder
                        key={office.city}
                        className="rounded-xl w-full"
                        borderWidth={1}
                      >
                        <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-center mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                              <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-foreground">
                            {office.city}
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            {office.region}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {office.description}
                          </p>
                        </Card>
                      </ShineBorder>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                    Nuestros Servicios
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {[
                      {
                        name: "Conciertos & Eventos",
                        icon: "🎵",
                        description: "Eventos exclusivos",
                      },
                      {
                        name: "Destinos Top",
                        icon: "🌍",
                        description: "Experiencias únicas",
                      },
                      {
                        name: "Quinceañeras",
                        icon: "👑",
                        description: "Celebraciones especiales",
                      },
                      {
                        name: "Bodas de Destino",
                        icon: "💒",
                        description: "Momentos inolvidables",
                      },
                    ].map((service) => (
                      <ShineBorder
                        key={service.name}
                        className="rounded-xl w-full"
                        borderWidth={1}
                      >
                        <Card className="p-6 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                          <div className="text-3xl mb-3">{service.icon}</div>
                          <h3 className="font-bold text-lg mb-2 text-foreground">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </Card>
                      </ShineBorder>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-12 text-center bg-transparent border-0 shadow-xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                      ¿Listo para tu próxima aventura?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Contáctanos hoy y descubre cómo podemos hacer de tu viaje
                      una experiencia inolvidable
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <WhatsAppCTA
                        template="Hola! Quiero más información sobre GabyTop Travel."
                        variables={{}}
                        label="Chatear por WhatsApp"
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
                      />
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-2"
                      >
                        <Link href="/destinations">Ver Destinos</Link>
                      </Button>
                    </div>
                  </Card>
                </ShineBorder>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
