import { z } from "zod";
import { DepartmentTypeSchema, NonEmptyStringSchema } from "./common";

// Service object schema
const ServiceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

// Contact info schemas
const ContactPhoneSchema = z.object({
  number: z.string().min(1, "Phone number is required"),
  label: z.string().optional(),
});

const ContactLocationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  label: z.string().optional(),
});

const ContactInfoSchema = z.object({
  emails: z.array(z.string().email()).optional(),
  phones: z.array(ContactPhoneSchema).optional(),
  locations: z.array(ContactLocationSchema).optional(),
});

export const DepartmentCreateSchema = z.object({
  type: DepartmentTypeSchema,
  title: NonEmptyStringSchema,
  intro: z.string().optional(),
  heroImageUrl: z.string().optional(),
  themeJson: z.any().optional(),
  servicesJson: z.array(ServiceSchema).optional(),
  contactInfoJson: ContactInfoSchema.optional(),
});

export const DepartmentUpdateSchema = DepartmentCreateSchema.partial();

export type DepartmentCreateInput = z.infer<typeof DepartmentCreateSchema>;
export type DepartmentUpdateInput = z.infer<typeof DepartmentUpdateSchema>;
