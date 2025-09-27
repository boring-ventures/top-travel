import { z } from "zod";

export const QuinceaneraDestinationCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  description: z.string().optional(),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.string().url()).optional(),
  location: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const QuinceaneraDestinationUpdateSchema =
  QuinceaneraDestinationCreateSchema.partial();

export type QuinceaneraDestinationCreate = z.infer<
  typeof QuinceaneraDestinationCreateSchema
>;
export type QuinceaneraDestinationUpdate = z.infer<
  typeof QuinceaneraDestinationUpdateSchema
>;
