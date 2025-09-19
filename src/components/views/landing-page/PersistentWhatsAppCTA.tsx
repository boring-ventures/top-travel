import { ClientWhatsAppCTA } from "@/components/utils/client-whatsapp-cta";

interface PersistentWhatsAppCTAProps {
  whatsappTemplate?: {
    templateBody: string;
    phoneNumber?: string;
    phoneNumbers?: string[];
  };
  fallbackPhone?: string;
}

export default function PersistentWhatsAppCTA({
  whatsappTemplate,
  fallbackPhone,
}: PersistentWhatsAppCTAProps) {
  return (
    <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <ClientWhatsAppCTA
          whatsappTemplate={
            whatsappTemplate
              ? {
                  templateBody: whatsappTemplate.templateBody,
                  phoneNumber: whatsappTemplate.phoneNumber,
                  phoneNumbers: whatsappTemplate.phoneNumbers,
                }
              : undefined
          }
          template={
            whatsappTemplate?.templateBody ||
            "Hola, me gustaría hablar con un asesor — {url}"
          }
          variables={{ url: "" }}
          label=""
          phone={fallbackPhone}
          variant="default"
          size="icon"
          className="shadow-lg w-14 h-14 rounded-full"
        />
      </div>
    </div>
  );
}
