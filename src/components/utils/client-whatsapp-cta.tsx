"use client";

import { useState, useEffect } from "react";
import { WhatsAppCTA } from "./whatsapp-cta";
import { getRandomPhoneNumber } from "@/lib/whatsapp-utils";

interface ClientWhatsAppCTAProps {
  template?: string;
  variables?: Record<string, string | undefined>;
  label?: string;
  phone?: string;
  campaign?: string;
  content?: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  whatsappTemplate?: {
    templateBody?: string;
    phoneNumber?: string;
    phoneNumbers?: string[];
  };
}

export function ClientWhatsAppCTA({
  template,
  variables,
  label,
  phone,
  campaign,
  content,
  className,
  variant,
  size,
  whatsappTemplate,
}: ClientWhatsAppCTAProps) {
  const [clientPhone, setClientPhone] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get random phone number on client side
    const randomPhone = getRandomPhoneNumber(whatsappTemplate as any);
    setClientPhone(randomPhone);
  }, [whatsappTemplate]);

  // Use the phone prop if provided, otherwise use the random phone from template
  const finalPhone = phone || clientPhone;

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <WhatsAppCTA
        template={template || whatsappTemplate?.templateBody || ""}
        variables={variables || {}}
        label={label}
        phone={phone || whatsappTemplate?.phoneNumber || ""}
        campaign={campaign}
        content={content}
        className={className}
        variant={variant}
        size={size}
      />
    );
  }

  return (
    <WhatsAppCTA
      template={template || whatsappTemplate?.templateBody || ""}
      variables={variables || {}}
      label={label}
      phone={finalPhone || undefined}
      campaign={campaign}
      content={content}
      className={className}
      variant={variant}
      size={size}
    />
  );
}
