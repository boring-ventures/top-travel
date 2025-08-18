"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";

export default function CustomizablePackages() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-stretch justify-between gap-4 rounded-lg">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-base font-bold leading-tight">
                Paquetes Diarios Personalizables
              </h3>
              <p className="text-muted-foreground text-sm font-normal leading-normal">
                Crea tu viaje de un día perfecto con nuestros paquetes personalizados. Ten en cuenta que las cotizaciones son personalizadas y no en tiempo real.
              </p>
            </div>
            <WhatsAppCTA
              template="¡Hola! Me gustaría cotizar un paquete personalizado — {url}"
              variables={{ url: "" }}
              label="Consultar ahora"
              size="sm"
              className="w-fit"
            />
          </div>
          <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1">
            <Image
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
              alt="Paquetes personalizables"
              width={400}
              height={225}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
