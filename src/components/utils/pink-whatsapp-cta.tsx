"use client";

import { ClientWhatsAppCTA } from "./client-whatsapp-cta";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [selectedPhone, setSelectedPhone] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Select random phone number on client side
    if (
      whatsappTemplate?.phoneNumbers &&
      whatsappTemplate.phoneNumbers.length > 0
    ) {
      const randomIndex = Math.floor(
        Math.random() * whatsappTemplate.phoneNumbers.length
      );
      setSelectedPhone(whatsappTemplate.phoneNumbers[randomIndex]);
    } else if (whatsappTemplate?.phoneNumber) {
      setSelectedPhone(whatsappTemplate.phoneNumber);
    } else if (phone) {
      setSelectedPhone(phone);
    }
  }, [whatsappTemplate, phone]);

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

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
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
            phoneNumbers={whatsappTemplate?.phoneNumbers}
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
          phoneNumbers={whatsappTemplate?.phoneNumbers}
          phone={selectedPhone}
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
