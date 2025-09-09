"use client";
import React from "react";
import { LayoutGrid } from "@/components/ui/layout-grid";

export default function Services() {
  return (
    <section className="py-12 w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Nuestros <span className="font-bold text-blue-600">Servicios</span>
          </h2>
        </div>
        <div className="h-screen py-20 w-full">
          <LayoutGrid cards={cards} />
        </div>
      </div>
    </section>
  );
}

const ServiceOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Vuelos y Alojamiento
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Nos encargamos de encontrar las mejores ofertas en vuelos y hoteles que
        se ajusten a su presupuesto y preferencias. Conectamos con las mejores
        aerolíneas y cadenas hoteleras del mundo.
      </p>
    </div>
  );
};

const ServiceTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Itinerarios Personalizados
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Diseñamos planes de viaje a medida, considerando sus intereses para una
        experiencia única e inolvidable. Cada detalle está pensado para crear
        recuerdos que durarán toda la vida.
      </p>
    </div>
  );
};

const ServiceThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Transporte y Tours
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Organizamos el transporte en su destino y le conectamos con los mejores
        tours y actividades locales. Descubra cada rincón con la comodidad y
        seguridad que merece.
      </p>
    </div>
  );
};

const ServiceFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Paquetes Vacacionales
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Ofrecemos paquetes todo incluido para que no tenga que preocuparse por
        nada más que disfrutar. Relájese y deje que nosotros nos encarguemos de
        todos los detalles.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <ServiceOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    content: <ServiceTwo />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    content: <ServiceThree />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    content: <ServiceFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
