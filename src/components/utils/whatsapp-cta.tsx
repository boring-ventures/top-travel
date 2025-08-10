"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getPersistedUtm } from "./utm-provider";

type WhatsAppCTAProps = {
  template: string;
  variables: Record<string, string | undefined>;
  label?: string;
  phone?: string;
  campaign?: string;
  content?: string;
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export function WhatsAppCTA({
  template,
  variables,
  label = "WhatsApp",
  phone,
  campaign = "cta",
  content,
  className,
  variant = "default",
  size = "default",
}: WhatsAppCTAProps) {
  const defaultPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  // Build a deterministic initial href for SSR and first client render
  const [href, setHref] = useState<string>(() =>
    buildWhatsAppUrl(phone || defaultPhone, template, variables, {
      utm: {
        source: "site",
        medium: "whatsapp",
        campaign,
        content,
      },
      pageUrl: undefined,
    })
  );

  // After mount, enhance with real page URL and any persisted UTM params
  useEffect(() => {
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : undefined;
    const persisted =
      typeof window !== "undefined" ? getPersistedUtm() : undefined;
    const enhanced = buildWhatsAppUrl(
      phone || defaultPhone,
      template,
      variables,
      {
        utm: {
          source: persisted?.utm_source || "site",
          medium: persisted?.utm_medium || "whatsapp",
          campaign: persisted?.utm_campaign || campaign,
          content: persisted?.utm_content || content,
        },
        pageUrl,
      }
    );
    setHref(enhanced);
    // We intentionally do not include variables object identity; assume caller passes stable object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, defaultPhone, template, campaign, content]);

  const handleClick = () => {
    try {
      // Basic tracking hook; GA4 integration will replace this (Task 5.3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = window as unknown as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "whatsapp_cta_click",
        label,
        campaign,
        content,
        utm: typeof window !== "undefined" ? (window as any).__utm : undefined,
        path:
          typeof window !== "undefined" ? window.location.pathname : undefined,
      });
    } catch {
      // no-op
    }
  };

  return (
    <Button
      asChild
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}

export default WhatsAppCTA;
