import {
  Hotel,
  Users,
  ShieldCheck,
  Plane,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";

const features = [
  {
    id: "premium-stays",
    icon: Hotel,
    title: "Hoteles y experiencias premium",
    description:
      "Selección cuidada de alojamientos y actividades únicas en cada destino.",
  },
  {
    id: "personalized",
    icon: Users,
    title: "Atención personalizada",
    description: "Acompañamiento experto antes, durante y después de tu viaje.",
  },
  {
    id: "safety",
    icon: ShieldCheck,
    title: "Seguridad y logística",
    description:
      "Protocolos claros y coordinación integral para viajes sin estrés.",
  },
  {
    id: "airfare",
    icon: Plane,
    title: "Aéreos y conexiones",
    description:
      "Optimización de rutas y tarifas para aprovechar mejor tu tiempo y presupuesto.",
  },
  {
    id: "destinations",
    icon: MapPin,
    title: "Destinos destacados",
    description:
      "Inspiración y curaduría de lugares top y exóticos para cada temporada.",
  },
  {
    id: "fixed",
    icon: CalendarDays,
    title: "Salidas fijas",
    description: "Fechas y cupos definidos para grupos y eventos especiales.",
  },
].map((feature, index) => ({
  ...feature,
  animationDelay: index * 100,
}));

export default function Features() {
  return (
    <section id="features" className="relative py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade className="text-center mb-16">
          <AnimatedShinyText>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué GABYTOPTRAVEL?
            </h2>
          </AnimatedShinyText>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Viajes personalizados con calidad, seguridad y servicio excepcional.
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <ShineBorder
              key={feature.id}
              duration={10}
              className="group relative backdrop-blur-sm rounded-xl overflow-hidden animate-in fade-in-0 duration-1000"
              borderWidth={1}
              color="rgba(var(--primary), 0.5)"
            >
              <div
                className="relative p-8"
                style={{ animationDelay: `${feature.animationDelay}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </ShineBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
