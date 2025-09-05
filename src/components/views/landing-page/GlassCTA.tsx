"use client";

import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";

interface GlassCTAProps {
  whatsappTemplate?: {
    templateBody?: string;
    phoneNumber?: string;
  };
}

export default function GlassCTA({ whatsappTemplate }: GlassCTAProps) {
  return (
    <section className="py-12 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">¿Listo para tu próxima <span className="font-light italic">aventura</span>?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo está listo para crear la experiencia perfecta para ti. 
            Consulta gratuita y atención personalizada.
          </p>
      </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <WhatsAppCTA
            template={
              whatsappTemplate?.templateBody ||
              "Hola, quiero planear mi próximo viaje — {url}"
            }
            variables={{ url: "" }}
            phone={whatsappTemplate?.phoneNumber}
            label="Hablar por WhatsApp"
            variant="default"
            size="lg"
            className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
