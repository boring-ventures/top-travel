import { z } from "zod";
import {
  ContentStatusSchema,
  CurrencySchema,
  NonEmptyStringSchema,
  SlugSchema,
} from "./common";

export const PackageCreateSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  summary: z.string().optional(),
  heroImageUrl: z.string().optional(),
  gallery: z.any().optional(),
  itineraryJson: z.any().optional(),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  durationDays: z.number().int().positive().optional(),
  fromPrice: z.coerce.number().positive().optional(),
  currency: CurrencySchema.optional(),
  isCustom: z.boolean().default(false),
  status: ContentStatusSchema.default("DRAFT"),
  destinationIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const PackageUpdateSchema = PackageCreateSchema.partial();

export type PackageCreateInput = z.infer<typeof PackageCreateSchema>;
export type PackageUpdateInput = z.infer<typeof PackageUpdateSchema>;
