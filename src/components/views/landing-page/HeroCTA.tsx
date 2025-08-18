import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";

interface HeroCTAProps {
  whatsappTemplate?: {
    templateBody: string;
    phoneNumber?: string;
  };
}

export default function HeroCTA({ whatsappTemplate }: HeroCTAProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-14">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
            Viajes premium, eventos y experiencias memorables
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Atención personalizada y logística segura para tu próximo concierto,
            boda de destino, quinceañera o escapada soñada.
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <WhatsAppCTA
            template={
              whatsappTemplate?.templateBody ||
              "Hola, quiero más información — {url}"
            }
            variables={{ url: "" }}
            phone={whatsappTemplate?.phoneNumber}
            label="Consultar por WhatsApp"
            variant="default"
            size="lg"
            className="w-full sm:w-auto text-sm sm:text-base"
          />
        </div>
      </div>
    </section>
  );
}
