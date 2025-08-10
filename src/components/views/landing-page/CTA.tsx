import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";

export default function CTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para planear tu viaje?
          </h2>
          <p className="text-xl mb-8">
            Escríbenos por WhatsApp y armamos tu experiencia a medida.
          </p>
          <WhatsAppCTA
            template="Hola, quiero planear mi próximo viaje — {url}"
            variables={{ url: "" }}
            label="Hablar por WhatsApp"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}
