import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { format } from "date-fns";

interface FixedDeparture {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface FixedDeparturesProps {
  fixedDepartures: FixedDeparture[];
}

export default function FixedDepartures({
  fixedDepartures,
}: FixedDeparturesProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Salidas fijas
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Fechas y cupos limitados
          </p>
        </div>
        <div className="hidden sm:block">
          <Button asChild variant="ghost" className="hover:bg-accent text-sm">
            <Link href="/fixed-departures">Ver todas</Link>
          </Button>
        </div>
      </div>

      {fixedDepartures.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No hay salidas fijas disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {fixedDepartures.map((fd, idx) => (
            <Card
              key={fd.id}
              className="border-border/60 hover:border-primary/40 transition-colors hover:shadow-md"
            >
              <Link
                href={`/fixed-departures/${fd.slug}`}
                className="block p-3 sm:p-4 md:p-5"
              >
                <BlurFade delay={idx * 0.05}>
                  <div className="font-medium text-foreground text-sm sm:text-base mb-1">
                    {fd.title}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {format(new Date(fd.startDate), "yyyy-MM-dd")} –{" "}
                    {format(new Date(fd.endDate), "yyyy-MM-dd")}
                  </div>
                </BlurFade>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
