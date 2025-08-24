import { z } from "zod";

export const BlogPostCreateSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  author: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  type: z.enum(["WEDDINGS", "QUINCEANERA"]),
});

export const BlogPostUpdateSchema = BlogPostCreateSchema.partial();

export type BlogPostCreate = z.infer<typeof BlogPostCreateSchema>;
export type BlogPostUpdate = z.infer<typeof BlogPostUpdateSchema>;
