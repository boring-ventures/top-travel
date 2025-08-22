"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateInput, EventCreateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}).omit({ startDate: true, endDate: true });

type EventFormInput = z.infer<typeof EventFormSchema>;

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
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
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      // Convert dateRange to startDate and endDate for API compatibility
      const apiData: EventCreateInput = {
        ...values,
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

      // Explicitly ensure heroImageUrl is included
      apiData.heroImageUrl = values.heroImageUrl;

      // Debug: Log the data being sent
      console.log("Sending event data:", apiData);
      console.log("heroImageUrl in apiData:", apiData.heroImageUrl);
      console.log("heroImageUrl type:", typeof apiData.heroImageUrl);
      console.log(
        "heroImageUrl === undefined:",
        apiData.heroImageUrl === undefined
      );
      console.log("heroImageUrl === null:", apiData.heroImageUrl === null);
      console.log("heroImageUrl === '':", apiData.heroImageUrl === "");

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Error al guardar el evento");
      }

      const result = await res.json();
      console.log("Event created successfully:", result);

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
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

      <div className="space-y-2">
        <Label>Imagen Principal</Label>
        <ImageUpload
          value={form.watch("heroImageUrl")}
          onChange={(url) => {
            console.log("ImageUpload onChange called with URL:", url);
            console.log("URL type:", typeof url);
            console.log("URL === '':", url === "");
            console.log("URL === undefined:", url === undefined);

            // Convert empty string to undefined
            const finalUrl = url === "" ? undefined : url;
            console.log("Final URL to set:", finalUrl);

            form.setValue("heroImageUrl", finalUrl);
            console.log(
              "Form heroImageUrl after setValue:",
              form.watch("heroImageUrl")
            );
          }}
          onUpload={async (file) => {
            console.log("ImageUpload onUpload called with file:", file);
            const slug = form.watch("slug") || "temp";
            console.log("Using slug for upload:", slug);
            const result = await uploadEventImage(file, slug);
            console.log("Upload result:", result);
            return result;
          }}
          placeholder="Imagen Principal del Evento"
          aspectRatio={16 / 9}
        />
        <div className="text-xs text-muted-foreground">
          Current heroImageUrl: {form.watch("heroImageUrl") || "None"}
        </div>
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
