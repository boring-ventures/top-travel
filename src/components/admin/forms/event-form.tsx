"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateInput, EventCreateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { AmenitiesInput } from "@/components/ui/amenities-input";
import { TagsInput } from "@/components/ui/tags-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { EventDateRangePicker } from "@/components/admin/forms/event-date-range-picker";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { uploadEventImage } from "@/lib/supabase/storage";

// Extended schema that includes dateRange for the form
const EventFormSchema = EventCreateSchema.extend({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  tagIds: z.array(z.string()).optional(),
}).omit({ startDate: true, endDate: true });

type EventFormInput = z.infer<typeof EventFormSchema>;

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const form = useForm<EventFormInput>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      artistOrEvent: "",
      locationCity: "",
      locationCountry: "",
      venue: "",
      heroImageUrl: undefined,
      amenities: [],
      exclusions: [],
      fromPrice: undefined,
      currency: undefined,
      detailsJson: undefined,
      gallery: undefined,
      dateRange: undefined,
      status: "DRAFT",
      tagIds: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let finalHeroImageUrl = values.heroImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        const slug = values.slug || "temp";
        finalHeroImageUrl = await uploadEventImage(selectedImageFile, slug);
      }

      // Convert dateRange to startDate and endDate for API compatibility
      const apiData: EventCreateInput = {
        ...values,
        heroImageUrl: finalHeroImageUrl,
        startDate:
          values.dateRange?.from?.toISOString() || new Date().toISOString(),
        endDate:
          values.dateRange?.to?.toISOString() || new Date().toISOString(),
      };

      // Remove the dateRange field as it's not part of the API schema
      delete (apiData as any).dateRange;

      // Clean up empty strings for other fields, but explicitly handle heroImageUrl
      Object.keys(apiData).forEach((key) => {
        if (
          apiData[key as keyof EventCreateInput] === "" &&
          key !== "heroImageUrl"
        ) {
          delete apiData[key as keyof EventCreateInput];
        }
      });

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      const result = await res.json();

      // Clear the selected file after successful submission
      setSelectedImageFile(null);

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
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
            placeholder="evento-unico"
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
            placeholder="Título del evento"
            className={form.formState.errors.title ? "border-red-500" : ""}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="artistOrEvent">Artista / Evento</Label>
          <Input
            id="artistOrEvent"
            {...form.register("artistOrEvent")}
            placeholder="Nombre del artista o evento"
            className={
              form.formState.errors.artistOrEvent ? "border-red-500" : ""
            }
          />
          {form.formState.errors.artistOrEvent && (
            <p className="text-sm text-red-500">
              {form.formState.errors.artistOrEvent.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="locationCity">Ciudad</Label>
          <Input
            id="locationCity"
            {...form.register("locationCity")}
            placeholder="Ciudad"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationCountry">País</Label>
          <Input
            id="locationCountry"
            {...form.register("locationCountry")}
            placeholder="País"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            {...form.register("venue")}
            placeholder="Lugar del evento"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromPrice">Precio desde</Label>
          <Input
            id="fromPrice"
            type="number"
            step="0.01"
            {...form.register("fromPrice")}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Select
            value={form.watch("currency")}
            onValueChange={(value: string) =>
              form.setValue("currency", value as "BOB" | "USD")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BOB">Bolivianos (BOB)</SelectItem>
              <SelectItem value="USD">Dólares (USD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <EventDateRangePicker
        control={form.control}
        name="dateRange"
        label="Período del Evento"
        placeholder="Seleccionar período del evento"
      />

      <TagsInput
        value={form.watch("tagIds") || []}
        onChange={(value) => form.setValue("tagIds", value)}
        label="Etiquetas"
        placeholder="Seleccionar etiquetas..."
      />

      <div className="space-y-2">
        <Label>Imagen Principal</Label>
        <ImageUpload
          value={form.watch("heroImageUrl")}
          onChange={(url) => {
            // Convert empty string to undefined
            const finalUrl = url === "" ? undefined : url;
            form.setValue("heroImageUrl", finalUrl);
          }}
          onFileSelect={(file) => setSelectedImageFile(file)}
          deferred={true}
          placeholder="Imagen Principal del Evento"
          aspectRatio={16 / 9}
        />
      </div>

      <AmenitiesInput
        label="Incluye"
        value={form.watch("amenities") || []}
        onChange={(value) => form.setValue("amenities", value)}
        placeholder="Ej: Entrada al evento, Bebidas, Parking..."
      />

      <AmenitiesInput
        label="No Incluye"
        value={form.watch("exclusions") || []}
        onChange={(value) => form.setValue("exclusions", value)}
        placeholder="Ej: Transporte, Comidas, Propinas..."
      />

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
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Evento"
          )}
        </Button>
      </div>
    </form>
  );
}
