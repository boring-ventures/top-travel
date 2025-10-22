"use client";

import { useState, useEffect } from "react";
import { WhatsAppCTA } from "./whatsapp-cta";

interface ClientWhatsAppCTAProps {
  template?: string;
  variables?: Record<string, string | undefined>;
  label?: string;
  phone?: string;
  phoneNumbers?: string[];
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
  phoneNumbers,
  campaign,
  content,
  className,
  variant,
  size,
  whatsappTemplate,
}: ClientWhatsAppCTAProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <WhatsAppCTA
        template={template || whatsappTemplate?.templateBody || ""}
        variables={variables || {}}
        label={label}
        phone={phone || whatsappTemplate?.phoneNumber || ""}
        phoneNumbers={phoneNumbers || whatsappTemplate?.phoneNumbers}
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
      phone={phone}
      phoneNumbers={phoneNumbers || whatsappTemplate?.phoneNumbers}
      campaign={campaign}
      content={content}
      className={className}
      variant={variant}
      size={size}
    />
  );
}
