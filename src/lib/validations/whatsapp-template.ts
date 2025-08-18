import { z } from "zod";
import { NonEmptyStringSchema } from "./common";

export const TemplateUsageTypeSchema = z.enum([
  "OFFERS",
  "PACKAGES", 
  "DESTINATIONS",
  "EVENTS",
  "FIXED_DEPARTURES",
  "GENERAL"
]);

export const WhatsAppTemplateCreateSchema = z.object({
  name: NonEmptyStringSchema,
  templateBody: NonEmptyStringSchema,
  phoneNumber: NonEmptyStringSchema,
  usageType: TemplateUsageTypeSchema,
  isDefault: z.boolean().optional(),
});

export const WhatsAppTemplateUpdateSchema =
  WhatsAppTemplateCreateSchema.partial();

export type WhatsAppTemplateCreateInput = z.infer<
  typeof WhatsAppTemplateCreateSchema
>;
export type WhatsAppTemplateUpdateInput = z.infer<
  typeof WhatsAppTemplateUpdateSchema
>;
export type TemplateUsageType = z.infer<typeof TemplateUsageTypeSchema>;
