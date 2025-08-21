"use client";

import Link from "next/link";
import Image from "next/image";
import TravelCard from "./TravelCard";

type Department = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  price?: string;
};

type SpecialDepartmentsProps = {
  departments: Department[];
};

export default function SpecialDepartments({
  departments,
}: SpecialDepartmentsProps) {
  // Don't render if no departments
  if (!departments.length) {
    return null;
  }

  return (
    <section className="py-8">
      <div
        className="container mx-auto"
        style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
      >
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Departamentos Especiales
        </h2>

        <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6 lg:gap-8">
          {departments.map((department) => (
            <div key={department.id} className="w-full lg:w-1/2 max-w-3xl">
              <TravelCard
                id={department.id}
                title={department.title}
                description={department.description}
                imageUrl={department.imageUrl}
                href={department.href}
                price={department.price}
                amenities={[
                  "Servicio personalizado",
                  "Experiencia única",
                  "Atención premium",
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
