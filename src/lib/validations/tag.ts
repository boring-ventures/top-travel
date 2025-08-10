import { z } from "zod";
import { NonEmptyStringSchema, SlugSchema, TagTypeSchema } from "./common";

export const TagCreateSchema = z.object({
  name: NonEmptyStringSchema,
  slug: SlugSchema,
  type: TagTypeSchema,
});

export const TagUpdateSchema = TagCreateSchema.partial();

export type TagCreateInput = z.infer<typeof TagCreateSchema>;
export type TagUpdateInput = z.infer<typeof TagUpdateSchema>;
