import { z } from "zod";
import {
  ContentStatusSchema,
  NonEmptyStringSchema,
  URLStringSchema,
} from "./common";

export const OfferCreateSchema = z
  .object({
    title: NonEmptyStringSchema,
    subtitle: z.string().optional(),
    bannerImageUrl: z.string().optional(),
    isFeatured: z.boolean().optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    status: ContentStatusSchema.default("DRAFT"),
    packageId: z.string().optional(),
    externalUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      // Either packageId or externalUrl can be set or none. If both set, allow but prefer package.
      return true;
    },
    { message: "Invalid offer target" }
  );

// Fallback to manual partial: re-declare as all-optional fields to avoid zod deepPartial issues
export const OfferUpdateSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  status: ContentStatusSchema.optional(),
  packageId: z.string().optional(),
  externalUrl: z.string().optional(),
});

export type OfferCreateInput = z.infer<typeof OfferCreateSchema>;
export type OfferUpdateInput = z.infer<typeof OfferUpdateSchema>;
