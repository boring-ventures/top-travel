import { z } from "zod";

export const IdSchema = z.string().min(1);

export const SlugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Must be a URL-safe slug (lowercase, hyphens).",
  });

export const URLStringSchema = z.string().url();

export const ISODateSchema = z
  .union([z.string().datetime({ offset: true }), z.string().datetime()])
  .or(z.coerce.date());

export const ContentStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const CurrencySchema = z.enum(["BOB", "USD"]);
export const TagTypeSchema = z.enum(["REGION", "THEME", "DEPARTMENT"]);
export const DepartmentTypeSchema = z.enum(["WEDDINGS", "QUINCEANERA"]);
export const TestimonialStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "PUBLISHED",
]);

export const OptionalStringSchema = z.string().trim().min(1).optional();
export const NonEmptyStringSchema = z.string().trim().min(1);
