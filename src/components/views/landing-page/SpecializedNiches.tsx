import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Music2, Heart, Sparkles, MapPin } from "lucide-react";

interface Department {
  id: string;
  type: string;
  title: string;
  heroImageUrl?: string;
  themeJson?: any;
}

interface SpecializedNichesProps {
  departments: Department[];
  topDestinations: any[];
}

export default function SpecializedNiches({
  departments,
  topDestinations,
}: SpecializedNichesProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Especialidades
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Descubre nuestras experiencias más solicitadas
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Conciertos y Eventos */}
        <Card className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow">
          <Link href="/events" className="block">
            <div className="h-32 sm:h-36 md:h-40 lg:h-44 w-full flex items-center justify-center bg-muted">
              <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-center px-2">
                <Music2
                  className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>Conciertos y Eventos</span>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                Accede a entradas, logística y experiencias VIP.
              </p>
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <span>Más información</span>
              </Button>
            </div>
          </Link>
        </Card>

        {/* Bodas Destino */}
        <Card className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow">
          <Link href="/weddings" className="block">
            <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full">
              {departments.find((d) => d.type === "WEDDINGS")?.heroImageUrl ? (
                <Image
                  src={
                    departments.find((d) => d.type === "WEDDINGS")!
                      .heroImageUrl!
                  }
                  alt="Bodas de destino"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Heart
                  className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base font-medium">
                  Bodas Destino
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                Planeamos tu "sí, acepto" en el lugar perfecto.
              </p>
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <span>Más información</span>
              </Button>
            </div>
          </Link>
        </Card>

        {/* Quinceañeras */}
        <Card className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow">
          <Link href="/quinceanera" className="block">
            <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full">
              {departments.find((d) => d.type === "QUINCEANERA")
                ?.heroImageUrl ? (
                <Image
                  src={
                    departments.find((d) => d.type === "QUINCEANERA")!
                      .heroImageUrl!
                  }
                  alt="Quinceañeras"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Sparkles
                  className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base font-medium">
                  Quinceañeras
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                Celebraciones únicas con estilo y seguridad.
              </p>
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <span>Más información</span>
              </Button>
            </div>
          </Link>
        </Card>

        {/* Destinos Top */}
        <Card className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow">
          <Link href="/destinations" className="block">
            <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full">
              {topDestinations[0]?.heroImageUrl ? (
                <Image
                  src={topDestinations[0].heroImageUrl}
                  alt={`${topDestinations[0].city}, ${topDestinations[0].country}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <MapPin
                  className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base font-medium">
                  Destinos Top
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                Inspiración para tu próxima aventura.
              </p>
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <span>Más información</span>
              </Button>
            </div>
          </Link>
        </Card>
      </div>
    </section>
  );
}
