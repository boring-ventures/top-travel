import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";

interface Event {
  id: string;
  slug: string;
  title: string;
  locationCity?: string;
  locationCountry?: string;
  startDate: string;
  endDate: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Próximos eventos
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Fechas y lugares destacados
          </p>
        </div>
        <div className="hidden sm:block">
          <Button asChild variant="ghost" className="hover:bg-accent text-sm">
            <Link href="/events">Ver eventos</Link>
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No hay eventos próximos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {events.map((e, idx) => (
            <Card
              key={e.id}
              className="border-border/60 hover:border-primary/40 transition-colors hover:shadow-md"
            >
              <Link
                href={`/events/${e.slug}`}
                className="block p-3 sm:p-4 md:p-5"
              >
                <BlurFade delay={idx * 0.05}>
                  <div className="font-medium text-foreground text-sm sm:text-base mb-1">
                    {e.title}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
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
