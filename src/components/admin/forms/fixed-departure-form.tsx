"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FixedDepartureCreateInput,
  FixedDepartureCreateSchema,
} from "@/lib/validations/fixed-departure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { AmenitiesInput } from "@/components/ui/amenities-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FixedDepartureDateRangePicker } from "@/components/admin/forms/fixed-departure-date-range-picker";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import {
  ContentStatusSchema,
  NonEmptyStringSchema,
  SlugSchema,
} from "@/lib/validations/common";
import { uploadFixedDepartureImage } from "@/lib/supabase/storage";

// Custom schema for the form that includes dateRange
const FixedDepartureFormSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  destinationId: z.string(),
  heroImageUrl: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  detailsJson: z.any().optional(),
  seatsInfo: z.string().optional(),
  status: ContentStatusSchema.default("DRAFT"),
});

type FixedDepartureFormInput = z.infer<typeof FixedDepartureFormSchema>;

export function FixedDepartureForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetch("/api/destinations").then((r) => r.json());
        setDestinations(d.items ?? d ?? []);
      } catch {}
    })();
  }, []);

  const form = useForm<FixedDepartureFormInput>({
    resolver: zodResolver(FixedDepartureFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      destinationId: "",
      heroImageUrl: "",
      amenities: [],
      exclusions: [],
      dateRange: undefined,
      detailsJson: undefined,
      seatsInfo: "",
      status: "DRAFT",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let finalHeroImageUrl = values.heroImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        const slug = values.slug || "temp";
        finalHeroImageUrl = await uploadFixedDepartureImage(
          selectedImageFile,
          slug
        );
      }

      // Convert dateRange to startDate and endDate for API compatibility
      const apiData: any = {
        ...values,
        heroImageUrl: finalHeroImageUrl,
        startDate:
          values.dateRange?.from?.toISOString() || new Date().toISOString(),
        endDate:
          values.dateRange?.to?.toISOString() || new Date().toISOString(),
      };

      // Remove the dateRange field as it's not part of the API schema
      delete apiData.dateRange;

      // Clean up empty strings to avoid validation issues
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "") {
          delete apiData[key];
        }
      });

      const res = await fetch("/api/fixed-departures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });
      if (!res.ok) throw new Error("Error al guardar la salida fija");
      onSuccess?.();
      form.reset();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="salida-unica"
            className={form.formState.errors.slug ? "border-red-500" : ""}
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-red-500">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Título de la salida fija"
            className={form.formState.errors.title ? "border-red-500" : ""}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="destinationId">Destino</Label>
          <Select
            value={form.watch("destinationId")}
            onValueChange={(value: string) =>
              form.setValue("destinationId", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar destino" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((destination) => (
                <SelectItem key={destination.id} value={destination.id}>
                  {destination.city}, {destination.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.destinationId && (
            <p className="text-sm text-red-500">
              {form.formState.errors.destinationId.message}
            </p>
          )}
        </div>
      </div>

      <FixedDepartureDateRangePicker
        control={form.control}
        name="dateRange"
        label="Período del Viaje"
        placeholder="Seleccionar período del viaje"
      />

      <div className="space-y-2">
        <Label>Imagen Principal</Label>
        <ImageUpload
          value={form.watch("heroImageUrl")}
          onChange={(url) => form.setValue("heroImageUrl", url)}
          onFileSelect={(file) => setSelectedImageFile(file)}
          deferred={true}
          placeholder="Imagen Principal de la Salida Fija"
          aspectRatio={16 / 9}
        />
      </div>

      <AmenitiesInput
        label="Incluye"
        value={form.watch("amenities") || []}
        onChange={(value) => form.setValue("amenities", value)}
        placeholder="Ej: Hotel, Transporte, Guía, Comidas..."
      />

      <AmenitiesInput
        label="No Incluye"
        value={form.watch("exclusions") || []}
        onChange={(value) => form.setValue("exclusions", value)}
        placeholder="Ej: Vuelos, Propinas, Gastos personales..."
      />

      <div className="space-y-2">
        <Label htmlFor="seatsInfo">Información de Asientos</Label>
        <Input
          id="seatsInfo"
          {...form.register("seatsInfo")}
          placeholder="Ej: 20 asientos disponibles"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value: string) =>
            form.setValue("status", value as "DRAFT" | "PUBLISHED")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Borrador</SelectItem>
            <SelectItem value="PUBLISHED">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar Salida Fija"}
        </Button>
      </div>
    </form>
  );
}
