/**
 * Client-side WhatsApp utilities that don't require Prisma
 */

interface WhatsAppTemplate {
  id?: string;
  name?: string;
  templateBody?: string;
  phoneNumber?: string;
  phoneNumbers?: string[];
  usageType?: string;
  isDefault?: boolean;
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

/**
 * Gets usage type for a given context
 */
export function getUsageTypeForContext(context: string): string {
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
    case "weddings":
      return "WEDDINGS";
    case "quinceanera":
      return "QUINCEANERA";
    default:
      return "GENERAL";
  }
}

/**
 * Formats WhatsApp message with variables
 */
export function formatWhatsAppMessage(
  template: string,
  variables: Record<string, string | undefined> = {}
): string {
  let message = template;

  // Replace variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, "g"), value);
    }
  });

  return message;
}

/**
 * Generates WhatsApp URL
 */
export function generateWhatsAppURL(phone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
