import prisma from "@/lib/prisma";
import type { TemplateUsageType } from "@/lib/validations/whatsapp-template";

interface WhatsAppTemplate {
  id: string;
  name: string;
  templateBody: string;
  phoneNumber?: string; // Keep for backward compatibility
  phoneNumbers: string[];
  usageType: TemplateUsageType;
  isDefault: boolean;
}

export async function getWhatsAppTemplateByUsage(
  usageType: TemplateUsageType
): Promise<WhatsAppTemplate | null> {
  try {
    // First try to find a template specific to this usage type
    let template = await prisma.whatsAppTemplate.findFirst({
      where: {
        usageType,
        isDefault: true,
      },
    });

    // If no default template for this type, find any template for this type
    if (!template) {
      template = await prisma.whatsAppTemplate.findFirst({
        where: {
          usageType,
        },
      });
    }

    // If still no template, fall back to general default template
    if (!template) {
      template = await prisma.whatsAppTemplate.findFirst({
        where: {
          usageType: "GENERAL",
          isDefault: true,
        },
      });
    }

    // Last resort: any general template
    if (!template) {
      template = await prisma.whatsAppTemplate.findFirst({
        where: {
          usageType: "GENERAL",
        },
      });
    }

    return template;
  } catch (error) {
    console.error("Error fetching WhatsApp template:", error);
    return null;
  }
}

export async function getDefaultWhatsAppTemplate(): Promise<WhatsAppTemplate | null> {
  try {
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        isDefault: true,
      },
    });

    if (!template) {
      // Fallback to any template
      return await prisma.whatsAppTemplate.findFirst();
    }

    return template;
  } catch (error) {
    console.error("Error fetching default WhatsApp template:", error);
    return null;
  }
}

export function getUsageTypeForContext(context: string): TemplateUsageType {
  switch (context) {
    case "offer":
    case "offers":
      return "OFFERS";
    case "package":
    case "packages":
      return "PACKAGES";
    case "destination":
    case "destinations":
      return "DESTINATIONS";
    case "event":
    case "events":
      return "EVENTS";
    case "fixed-departure":
    case "fixed-departures":
      return "FIXED_DEPARTURES";
    default:
      return "GENERAL";
  }
}

/**
 * Gets a random phone number from a WhatsApp template
 * For SSR: returns first phone number to avoid hydration issues
 * For client: returns truly random phone number for load balancing
 * Falls back to the single phoneNumber field for backward compatibility
 */
export function getRandomPhoneNumber(
  template: WhatsAppTemplate | null
): string | null {
  if (!template) return null;

  // Use phoneNumbers array if available
  if (template.phoneNumbers && template.phoneNumbers.length > 0) {
    // On server side, always return first number to avoid hydration issues
    if (typeof window === "undefined") {
      return template.phoneNumbers[0];
    }

    // On client side, return random number for load balancing
    const randomIndex = Math.floor(
      Math.random() * template.phoneNumbers.length
    );
    return template.phoneNumbers[randomIndex];
  }

  // Fallback to single phoneNumber for backward compatibility
  return template.phoneNumber || null;
}
