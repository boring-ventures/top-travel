import { z } from "zod";

export const WeddingDestinationCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().default(false),
});

export const WeddingDestinationUpdateSchema =
  WeddingDestinationCreateSchema.partial();

export type WeddingDestinationCreate = z.infer<
  typeof WeddingDestinationCreateSchema
>;
export type WeddingDestinationUpdate = z.infer<
  typeof WeddingDestinationUpdateSchema
>;
