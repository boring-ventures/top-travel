import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";

interface PersistentWhatsAppCTAProps {
  whatsappTemplate?: {
    templateBody: string;
    phoneNumber?: string;
  };
}

export default function PersistentWhatsAppCTA({
  whatsappTemplate,
}: PersistentWhatsAppCTAProps) {
  return (
    <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <WhatsAppCTA
          template={
            whatsappTemplate?.templateBody ||
            "Hola, me gustaría hablar con un asesor — {url}"
          }
          variables={{ url: "" }}
          phone={whatsappTemplate?.phoneNumber}
          label=""
          variant="default"
          size="icon"
          className="shadow-lg w-14 h-14 rounded-full"
        />
      </div>
    </div>
  );
}
