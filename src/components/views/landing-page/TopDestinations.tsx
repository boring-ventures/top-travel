import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { MapPin } from "lucide-react";
import { isValidImageUrl } from "@/lib/utils";

interface Destination {
  id: string;
  slug: string;
  city: string;
  country: string;
  heroImageUrl?: string;
  description?: string;
}

interface TopDestinationsProps {
  destinations: Destination[];
}

export default function TopDestinations({
  destinations,
}: TopDestinationsProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Destinos Destacados
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Inspírate con nuestra selección
          </p>
        </div>
        <div className="hidden sm:block">
          <Button asChild variant="ghost" className="hover:bg-accent text-sm">
            <Link href="/destinations">Explorar</Link>
          </Button>
        </div>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-muted/30 rounded-xl">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
            <p className="text-base sm:text-lg font-medium">
              Aún no hay destinos destacados
            </p>
            <p className="text-xs sm:text-sm">
              Próximamente añadiremos increíbles destinos.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {destinations.map((d) => (
            <Card
              key={d.id}
              className="overflow-hidden rounded-xl border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
            >
              <Link href={`/destinations/${d.slug}`} className="block">
                {/* Image Section */}
                <div className="relative h-40 sm:h-48 md:h-56 w-full">
                  {d.heroImageUrl && isValidImageUrl(d.heroImageUrl) ? (
                    <Image
                      src={d.heroImageUrl}
                      alt={`${d.city}, ${d.country}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
                      <div className="text-muted-foreground text-center">
                        <div className="text-2xl mb-2">🌍</div>
                        <div className="text-sm">Imagen no disponible</div>
                      </div>
                    </div>
                  )}
                  {/* Location Badge */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex gap-1 sm:gap-2">
                    <div className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-2 sm:px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      Destino
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-4">
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                    {d.city}, {d.country}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                    {d.description ||
                      `Descubre la belleza y cultura de ${d.city}, ${d.country}. Una experiencia única te espera.`}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <span>👁️</span>
                      <span>Explorar</span>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <span>📸</span>
                      <span>Fotos</span>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <span>🗺️</span>
                      <span>Guía</span>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <Button
                    asChild
                    className="w-full rounded-lg h-9 sm:h-10 text-sm"
                  >
                    <span>
                      Explorar destino
                      <span className="ml-1">→</span>
                    </span>
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
