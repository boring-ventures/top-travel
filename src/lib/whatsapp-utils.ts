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
