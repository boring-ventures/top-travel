import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Target,
  Users,
  Globe,
  Star,
  Sparkles,
  Compass,
  Shield,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { ShineBorder } from "@/components/magicui/shine-border";
import Link from "next/link";

export default async function MissionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-pink-600 to-rose-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Nuestra Misión
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-red-300">
                  Servicio Excepcional
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Brindar un servicio excepcional, seguro y personalizado para
                convertir cada viaje en un recuerdo inolvidable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Servicio personalizado
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Seguridad garantizada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-16 sm:space-y-20">
              {/* Mission Statement */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                  Nuestra Misión Fundamental
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  En GabyTop Travel, nuestra misión es simple pero poderosa:
                  transformar cada viaje en una experiencia extraordinaria. Nos
                  comprometemos a brindar un servicio que va más allá de las
                  expectativas, creando momentos que perduran para siempre.
                </p>
              </div>

              {/* Core Commitments */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                          <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Servicio Excepcional
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      Superar las expectativas en cada interacción, desde la
                      primera consulta hasta el regreso del viaje.
                    </p>
                  </Card>
                </ShineBorder>

                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                          <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Seguridad Garantizada
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      Garantizar la seguridad y bienestar de nuestros clientes
                      en cada aspecto de su viaje.
                    </p>
                  </Card>
                </ShineBorder>

                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Atención Personalizada
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      Crear experiencias únicas adaptadas a las necesidades y
                      deseos específicos de cada cliente.
                    </p>
                  </Card>
                </ShineBorder>
              </div>

              {/* Service Philosophy */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                  Nuestra Filosofía de Servicio
                </h2>
                <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                          <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Enfoque Centrado en el Cliente
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Cada decisión que tomamos está orientada a maximizar la
                        satisfacción y felicidad de nuestros clientes.
                      </p>
                    </Card>
                  </ShineBorder>
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                          <Sparkles className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Detalles que Marcan la Diferencia
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Nos enfocamos en los pequeños detalles que transforman
                        un viaje ordinario en una experiencia extraordinaria.
                      </p>
                    </Card>
                  </ShineBorder>
                </div>
              </div>

              {/* Commitment Areas */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                  Áreas de Compromiso
                </h2>
                <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-full">
                          <Globe className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Experiencias Únicas
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Diseñamos itinerarios que van más allá de lo
                        convencional, creando experiencias auténticas y
                        memorables.
                      </p>
                    </Card>
                  </ShineBorder>
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                          <Star className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Calidad Premium
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Trabajamos solo con los mejores proveedores y destinos
                        para garantizar la más alta calidad.
                      </p>
                    </Card>
                  </ShineBorder>
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-full">
                          <Compass className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Soporte 24/7
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Estamos disponibles en todo momento para asistir a
                        nuestros clientes durante su viaje.
                      </p>
                    </Card>
                  </ShineBorder>
                </div>
              </div>

              {/* CTA Section */}
              <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                <Card className="p-12 text-center bg-transparent border-0 shadow-xl">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                    Experimenta Nuestra Misión
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Descubre cómo nuestra misión se traduce en experiencias
                    reales. Permítenos crear tu próxima aventura inolvidable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <WhatsAppCTA
                      template="Hola! Quiero conocer más sobre la misión de GabyTop Travel."
                      variables={{}}
                      label="Chatear por WhatsApp"
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
                    />
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-2"
                    >
                      <Link href="/events">Ver Eventos</Link>
                    </Button>
                  </div>
                </Card>
              </ShineBorder>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
