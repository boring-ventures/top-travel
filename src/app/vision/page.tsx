import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Target,
  TrendingUp,
  Globe,
  Star,
  Sparkles,
  Compass,
  Lightbulb,
} from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";
import { ShineBorder } from "@/components/magicui/shine-border";
import Link from "next/link";

export default async function VisionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 -z-10" />

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Nuestra Visión
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  El Futuro del Turismo
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Ser la agencia líder en Bolivia, reconocida por innovación y
                presencia nacional. Socio preferido para experiencias únicas
                alrededor del mundo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Líder en innovación turística
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80 drop-shadow-sm">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Presencia nacional e internacional
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
              {/* Vision Statement */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                  Nuestra Visión Estratégica
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  En GabyTop Travel, visualizamos un futuro donde cada viaje sea
                  una experiencia transformadora. Nos esforzamos por ser la
                  agencia de referencia en Bolivia, combinando innovación
                  tecnológica con el toque humano que hace la diferencia.
                </p>
              </div>

              {/* Strategic Pillars */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Liderazgo
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      Ser reconocidos como la agencia líder en Bolivia,
                      estableciendo estándares de excelencia en el sector
                      turístico.
                    </p>
                  </Card>
                </ShineBorder>

                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-purple-100 rounded-full">
                          <Lightbulb className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Innovación
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      Implementar tecnologías avanzadas y metodologías
                      innovadoras para crear experiencias únicas.
                    </p>
                  </Card>
                </ShineBorder>

                <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                  <Card className="p-8 text-center bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Globe className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        Expansión
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      Expandir nuestra presencia nacional e internacional,
                      llevando la excelencia boliviana al mundo.
                    </p>
                  </Card>
                </ShineBorder>
              </div>

              {/* Future Goals */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                  Nuestros Objetivos a Futuro
                </h2>
                <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Star className="h-8 w-8 text-orange-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Cobertura Nacional
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Establecer presencia en todas las ciudades principales
                        de Bolivia, ofreciendo servicios locales y
                        especializados.
                      </p>
                    </Card>
                  </ShineBorder>
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Compass className="h-8 w-8 text-red-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Destinos Internacionales
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Ampliar nuestra red de destinos internacionales,
                        incluyendo destinos emergentes y exclusivos.
                      </p>
                    </Card>
                  </ShineBorder>
                </div>
              </div>

              {/* Technology Vision */}
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-foreground">
                  Innovación Tecnológica
                </h2>
                <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-cyan-100 rounded-full">
                          <Eye className="h-8 w-8 text-cyan-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Experiencia Digital
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Plataformas digitales avanzadas para una experiencia de
                        reserva fluida y personalizada.
                      </p>
                    </Card>
                  </ShineBorder>
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-indigo-100 rounded-full">
                          <Sparkles className="h-8 w-8 text-indigo-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        IA y Personalización
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Inteligencia artificial para recomendaciones
                        personalizadas y atención predictiva.
                      </p>
                    </Card>
                  </ShineBorder>
                  <ShineBorder className="rounded-xl w-full" borderWidth={1}>
                    <Card className="p-8 bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-2 bg-emerald-100 rounded-full">
                          <Target className="h-8 w-8 text-emerald-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-foreground">
                        Sostenibilidad
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Tecnologías verdes y prácticas sostenibles en todos
                        nuestros servicios y operaciones.
                      </p>
                    </Card>
                  </ShineBorder>
                </div>
              </div>

              {/* CTA Section */}
              <ShineBorder className="rounded-2xl w-full" borderWidth={1}>
                <Card className="p-12 text-center bg-transparent border-0 shadow-xl">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                    Únete a Nuestra Visión
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Sé parte del futuro del turismo en Bolivia. Descubre cómo
                    estamos transformando las experiencias de viaje.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <WhatsAppCTA
                      template="Hola! Quiero conocer más sobre la visión de GabyTop Travel."
                      variables={{}}
                      label="Chatear por WhatsApp"
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                    />
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-2"
                    >
                      <Link href="/packages">Explorar Paquetes</Link>
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
