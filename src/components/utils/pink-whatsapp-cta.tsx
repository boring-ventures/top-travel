"use client";

import { ClientWhatsAppCTA } from "./client-whatsapp-cta";
import { cn } from "@/lib/utils";

interface PinkWhatsAppCTAProps {
  whatsappTemplate?: {
    templateBody: string;
    phoneNumber?: string;
    phoneNumbers?: string[];
  };
  variant?: "quinceanera" | "weddings";
  phone?: string;
}

export default function PinkWhatsAppCTA({
  whatsappTemplate,
  variant = "quinceanera",
  phone,
}: PinkWhatsAppCTAProps) {
  const getTemplate = () => {
    if (whatsappTemplate?.templateBody) {
      return whatsappTemplate.templateBody;
    }

    if (variant === "weddings") {
      return "Hola! Me interesa información sobre bodas de destino — {url}";
    }

    return "Hola! Me interesa información sobre quinceañeras — {url}";
  };

  const getPhone = () => {
    // If phone is explicitly provided, always use it
    if (phone) {
      return phone;
    }
    // Otherwise, use template's phone number
    if (whatsappTemplate?.phoneNumber) {
      return whatsappTemplate.phoneNumber;
    }
    if (whatsappTemplate?.phoneNumbers?.[0]) {
      return whatsappTemplate.phoneNumbers[0];
    }
    // Fallback to empty string if no phone available
    return "";
  };

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
          template={getTemplate()}
          variables={{ url: "" }}
          label=""
          phone={getPhone()}
          variant="default"
          size="icon"
          className={cn(
            "shadow-lg w-14 h-14 rounded-full transition-all duration-300 hover:scale-110",
            variant === "weddings"
              ? "bg-[#eaa298] hover:bg-[#d49186] border-[#eaa298] hover:border-[#d49186]"
              : "bg-[#e03d90] hover:bg-[#c8327a] border-[#e03d90] hover:border-[#c8327a]"
          )}
        />
      </div>
    </div>
  );
}
