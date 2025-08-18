import { z } from "zod";
import { NonEmptyStringSchema, SlugSchema } from "./common";

export const DestinationCreateSchema = z.object({
  slug: SlugSchema,
  country: NonEmptyStringSchema,
  city: NonEmptyStringSchema,
  description: z.string().optional(),
  heroImageUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  displayTag: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const DestinationUpdateSchema = DestinationCreateSchema.partial();

export type DestinationCreateInput = z.infer<typeof DestinationCreateSchema>;
export type DestinationUpdateInput = z.infer<typeof DestinationUpdateSchema>;
