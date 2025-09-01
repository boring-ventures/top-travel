"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Heart,
  Shield,
  Users,
  Map,
  Crown,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { ShineBorder } from "@/components/magicui/shine-border";

const services = [
  {
    icon: Plane,
    title: "Logística Completa",
    description:
      "Manejamos todos los detalles del viaje: vuelos, hoteles, traslados y actividades para que solo te enfoques en disfrutar.",
    color: "from-blue-500 to-blue-600",
    features: ["Reservas confirmadas", "Traslados incluidos", "Soporte 24/7"],
  },
  {
    icon: Heart,
    title: "Experiencias Personalizadas",
    description:
      "Creamos itinerarios únicos adaptados a tus gustos, intereses y estilo de viaje preferido.",
    color: "from-pink-500 to-pink-600",
    features: [
      "Consultas personalizadas",
      "Itinerarios flexibles",
      "Ajustes en tiempo real",
    ],
  },
  {
    icon: Shield,
    title: "Seguridad Garantizada",
    description:
      "Trabajamos solo con proveedores verificados y establecemos protocolos de seguridad para tu tranquilidad.",
    color: "from-green-500 to-green-600",
    features: [
      "Proveedores verificados",
      "Seguros incluidos",
      "Protocolos de seguridad",
    ],
  },
  {
    icon: Users,
    title: "Atención Personalizada",
    description:
      "Nuestro equipo experto te acompaña en cada paso, desde la planificación hasta el regreso a casa.",
    color: "from-purple-500 to-purple-600",
    features: [
      "Asesoría experta",
      "Acompañamiento continuo",
      "Soporte multilingüe",
    ],
  },
  {
    icon: Map,
    title: "Destinos Exclusivos",
    description:
      "Acceso a lugares únicos y experiencias que no encontrarías por tu cuenta, seleccionados por nuestros expertos.",
    color: "from-orange-500 to-orange-600",
    features: ["Lugares exclusivos", "Experiencias únicas", "Acceso VIP"],
  },
  {
    icon: Crown,
    title: "Servicio Premium",
    description:
      "Ofrecemos un servicio de lujo con atención al detalle, para que tu viaje sea verdaderamente extraordinario.",
    color: "from-yellow-500 to-yellow-600",
    features: [
      "Atención al detalle",
      "Servicios premium",
      "Experiencia de lujo",
    ],
  },
];

export default function Services() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
          Nuestros Servicios
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Ofrecemos una experiencia completa de viaje con atención personalizada
          y logística impecable
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <ShineBorder
              key={index}
              className="rounded-xl w-full"
              borderWidth={1}
            >
              <Card className="h-full bg-transparent border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ShineBorder>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <ShineBorder className="rounded-full p-3" borderWidth={1}>
              <Star className="h-8 w-8 text-blue-600" />
            </ShineBorder>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-foreground">
            ¿Por qué elegirnos?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Más de 10 años de experiencia creando viajes inolvidables con
            atención personalizada y logística impecable
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full"
            >
              <Link href="/contact">Solicitar Cotización</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/about">Conoce Nuestra Historia</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
