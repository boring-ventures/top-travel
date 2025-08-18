import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, Heart, Users } from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) /
        testimonials.length
      : 5;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Testimonios de Nuestros Clientes
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Descubre lo que dicen nuestros clientes sobre sus experiencias
                con GabyTop Travel
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-white/30"}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  {averageRating.toFixed(1)} de 5 estrellas
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {testimonials.length}
              </div>
              <div className="text-sm text-muted-foreground">Testimonios</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Calificación Promedio
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">
                Clientes Satisfechos
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="container mx-auto px-4 pb-16">
          {testimonials.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  No hay testimonios aún
                </h3>
                <p className="text-sm">
                  Sé el primero en compartir tu experiencia
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">
                  Experiencias de Nuestros Clientes
                </h2>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {testimonials.length} testimonios
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <Card
                    key={t.id}
                    className="p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pink-100 rounded-full">
                        <Quote className="h-6 w-6 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (t.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {t.rating || 5}/5
                          </Badge>
                        </div>

                        <blockquote className="text-sm text-muted-foreground mb-4 italic">
                          "{t.content}"
                        </blockquote>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">
                              {t.authorName}
                            </div>
                            {t.location && (
                              <div className="text-xs text-muted-foreground">
                                {t.location}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(t.createdAt).toLocaleDateString("es-ES", {
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16">
          <Card className="p-8 text-center bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                ¿Listo para crear tu propia historia?
              </h2>
              <p className="text-muted-foreground mb-6">
                Únete a nuestros clientes satisfechos y descubre por qué GabyTop
                Travel es la elección perfecta para tus viajes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <WhatsAppCTA
                  template="Hola! Quiero planificar mi próximo viaje con GabyTop Travel."
                  variables={{}}
                  label="Planificar Mi Viaje"
                  size="lg"
                />
                <Button variant="outline" size="lg">
                  Ver Destinos
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
