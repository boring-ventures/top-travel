import { z } from "zod";
import {
  ContentStatusSchema,
  ISODateSchema,
  NonEmptyStringSchema,
  SlugSchema,
} from "./common";

export const FixedDepartureCreateSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  destinationId: z.string(),
  startDate: ISODateSchema,
  endDate: ISODateSchema,
  heroImageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  detailsJson: z.any().optional(),
  seatsInfo: z.string().optional(),
  status: ContentStatusSchema.default("DRAFT"),
});

export const FixedDepartureUpdateSchema = FixedDepartureCreateSchema.partial();

export type FixedDepartureCreateInput = z.infer<
  typeof FixedDepartureCreateSchema
>;
export type FixedDepartureUpdateInput = z.infer<
  typeof FixedDepartureUpdateSchema
>;
