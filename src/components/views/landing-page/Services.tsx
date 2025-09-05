"use client";

import {
  Plane,
  Map,
  Car,
  Calendar,
  Headphones,
  Shield,
} from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Vuelos y Alojamiento",
    description: "Nos encargamos de encontrar las mejores ofertas en vuelos y hoteles que se ajusten a su presupuesto y preferencias.",
  },
  {
    icon: Map,
    title: "Itinerarios Personalizados",
    description: "Diseñamos planes de viaje a medida, considerando sus intereses para una experiencia única e inolvidable.",
  },
  {
    icon: Car,
    title: "Transporte y Tours",
    description: "Organizamos el transporte en su destino y le conectamos con los mejores tours y actividades locales.",
  },
  {
    icon: Calendar,
    title: "Paquetes Vacacionales",
    description: "Ofrecemos paquetes todo incluido para que no tenga que preocuparse por nada más que disfrutar.",
  },
  {
    icon: Headphones,
    title: "Asistencia 24/7",
    description: "Nuestro equipo de soporte está disponible 24/7 para ayudarle con cualquier imprevisto durante su viaje.",
  },
  {
    icon: Shield,
    title: "Seguro de Viaje",
    description: "Le ayudamos a gestionar el seguro de viaje más completo para su tranquilidad y seguridad.",
  },
];

export default function Services() {
  return (
    <section className="py-12 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Nuestros <span className="font-light italic">Servicios</span></h1>
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <IconComponent className="text-black mr-4 text-3xl flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
