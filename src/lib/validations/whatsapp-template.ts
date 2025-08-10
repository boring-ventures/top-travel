import { z } from "zod";
import { NonEmptyStringSchema } from "./common";

export const WhatsAppTemplateCreateSchema = z.object({
  name: NonEmptyStringSchema,
  templateBody: NonEmptyStringSchema,
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
