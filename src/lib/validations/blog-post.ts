import { z } from "zod";
import { DepartmentType, ContentStatus } from "@prisma/client";

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  content: z.string().min(1, "Content is required"),
  heroImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  author: z
    .string()
    .max(100, "Author name must be less than 100 characters")
    .optional(),
  status: z.nativeEnum(ContentStatus),
  type: z.nativeEnum(DepartmentType),
});

export const blogPostUpdateSchema = blogPostSchema.partial().extend({
  id: z.string().cuid(),
});

export const blogPostFilterSchema = z.object({
  type: z.nativeEnum(DepartmentType).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
export type BlogPostFilter = z.infer<typeof blogPostFilterSchema>;
