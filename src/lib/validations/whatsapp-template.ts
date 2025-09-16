import { z } from "zod";
import { NonEmptyStringSchema } from "./common";

export const TemplateUsageTypeSchema = z.enum([
  "OFFERS",
  "PACKAGES",
  "DESTINATIONS",
  "EVENTS",
  "FIXED_DEPARTURES",
  "GENERAL",
]);

export const WhatsAppTemplateCreateSchema = z.object({
  name: NonEmptyStringSchema,
  templateBody: NonEmptyStringSchema,
  phoneNumber: z.string().optional(), // Allow empty string for backward compatibility
  phoneNumbers: z
    .array(z.string())
    .transform((arr) => arr.filter((phone) => phone.trim() !== ""))
    .refine((arr) => arr.length > 0, {
      message: "At least one phone number is required",
    }),
  usageType: TemplateUsageTypeSchema,
  isDefault: z.boolean().optional(),
});

export const WhatsAppTemplateUpdateSchema = z.object({
  name: NonEmptyStringSchema.optional(),
  templateBody: NonEmptyStringSchema.optional(),
  phoneNumber: z.string().optional(), // Allow empty string for backward compatibility
  phoneNumbers: z
    .array(z.string())
    .transform((arr) => arr.filter((phone) => phone.trim() !== ""))
    .refine((arr) => arr.length > 0, {
      message: "At least one phone number is required",
    })
    .optional(),
  usageType: TemplateUsageTypeSchema.optional(),
  isDefault: z.boolean().optional(),
});

export type WhatsAppTemplateCreateInput = z.infer<
  typeof WhatsAppTemplateCreateSchema
>;
export type WhatsAppTemplateUpdateInput = z.infer<
  typeof WhatsAppTemplateUpdateSchema
>;
export type TemplateUsageType = z.infer<typeof TemplateUsageTypeSchema>;
