import { z } from "zod";
import { NonEmptyStringSchema, TestimonialStatusSchema } from "./common";

export const TestimonialCreateSchema = z.object({
  authorName: NonEmptyStringSchema,
  location: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  content: NonEmptyStringSchema,
  status: TestimonialStatusSchema.default("PENDING"),
});

export const TestimonialUpdateSchema = TestimonialCreateSchema.partial();

export type TestimonialCreateInput = z.infer<typeof TestimonialCreateSchema>;
export type TestimonialUpdateInput = z.infer<typeof TestimonialUpdateSchema>;
