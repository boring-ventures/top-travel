import { z } from "zod";
import { DepartmentTypeSchema, NonEmptyStringSchema } from "./common";

export const DepartmentCreateSchema = z.object({
  type: DepartmentTypeSchema,
  title: NonEmptyStringSchema,
  intro: z.string().optional(),
  heroImageUrl: z.string().optional(),
  themeJson: z.any().optional(),
  featuredItemRefs: z.any().optional(),
});

export const DepartmentUpdateSchema = DepartmentCreateSchema.partial();

export type DepartmentCreateInput = z.infer<typeof DepartmentCreateSchema>;
export type DepartmentUpdateInput = z.infer<typeof DepartmentUpdateSchema>;
