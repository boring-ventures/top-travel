import { z } from "zod";
import {
  ContentStatusSchema,
  CurrencySchema,
  NonEmptyStringSchema,
  SlugSchema,
  ISODateSchema,
} from "./common";

export const EventCreateSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  artistOrEvent: NonEmptyStringSchema,
  destinationId: z.string().optional(),
  venue: z.string().optional(),
  startDate: ISODateSchema,
  endDate: ISODateSchema,
  heroImageUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  pdfUrl: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  detailsJson: z.any().optional(),
  gallery: z.any().optional(),
  fromPrice: z.coerce.number().positive().optional(),
  currency: CurrencySchema.optional(),
  status: ContentStatusSchema.default("DRAFT"),
  tagIds: z.array(z.string()).optional(),
});

export const EventUpdateSchema = EventCreateSchema.partial();

export type EventCreateInput = z.infer<typeof EventCreateSchema>;
export type EventUpdateInput = z.infer<typeof EventUpdateSchema>;
