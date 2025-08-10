import { z } from "zod";
import {
  ContentStatusSchema,
  NonEmptyStringSchema,
  SlugSchema,
} from "./common";

export const PageCreateSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  sectionsJson: z.any().optional(),
  status: ContentStatusSchema.default("DRAFT"),
});

export const PageUpdateSchema = PageCreateSchema.partial();

export type PageCreateInput = z.infer<typeof PageCreateSchema>;
export type PageUpdateInput = z.infer<typeof PageUpdateSchema>;
