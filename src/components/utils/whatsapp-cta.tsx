"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl, getRandomPhoneNumber } from "@/lib/utils";
import { getPersistedUtm } from "./utm-provider";

type WhatsAppCTAProps = {
  template: string;
  variables: Record<string, string | undefined>;
  label?: string;
  phone?: string;
  phoneNumbers?: string[];
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
  phoneNumbers,
  campaign = "cta",
  content,
  className,
  variant = "default",
  size = "default",
}: WhatsAppCTAProps) {
  const defaultPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  // Get the phone number to use (random selection happens on click)
  const getPhoneNumber = () => {
    // Prioritize phoneNumbers array for random selection
    if (phoneNumbers && phoneNumbers.length > 0) {
      return getRandomPhoneNumber(phoneNumbers);
    }
    // Fallback to single phone number
    if (phone) return phone;
    return defaultPhone;
  };

  // Build a deterministic initial href for SSR and first client render
  const [href, setHref] = useState<string>(() => {
    const initialVariables = {
      ...variables,
      url: "",
    };
    return buildWhatsAppUrl(getPhoneNumber(), template, initialVariables, {
      utm: {
        source: "site",
        medium: "whatsapp",
        campaign,
        content,
      },
      pageUrl: undefined,
    });
  });

  // After mount, enhance with real page URL, persisted UTM params
  useEffect(() => {
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : undefined;
    const persisted =
      typeof window !== "undefined" ? getPersistedUtm() : undefined;

    // Enhanced variables with URL data
    const enhancedVariables = {
      ...variables,
      url: pageUrl || "",
    };

    const enhanced = buildWhatsAppUrl(
      getPhoneNumber(),
      template,
      enhancedVariables,
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
  }, [phone, phoneNumbers, defaultPhone, template, campaign, content]);

  const handleClick = () => {
    try {
      // Generate new URL with random phone number on each click
      const pageUrl =
        typeof window !== "undefined" ? window.location.href : undefined;
      const persisted =
        typeof window !== "undefined" ? getPersistedUtm() : undefined;

      const enhancedVariables = {
        ...variables,
        url: pageUrl || "",
      };

      const newHref = buildWhatsAppUrl(
        getPhoneNumber(),
        template,
        enhancedVariables,
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

      // Update href for the link
      setHref(newHref);

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
      className={`${className} bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 transition-all duration-200`}
      variant={variant}
      size={size}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact via WhatsApp"
      >
        <svg
          className={`${label ? "mr-2" : ""} h-6 w-6`}
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
        {label}
      </a>
    </Button>
  );
}

export default WhatsAppCTA;
