"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateInput, EventCreateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  ContentStatusSchema,
  NonEmptyStringSchema,
  SlugSchema,
} from "@/lib/validations/common";

// Custom schema for the form that includes dateRange
const EventFormSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  artistOrEvent: NonEmptyStringSchema,
  locationCity: z.string().optional(),
  locationCountry: z.string().optional(),
  venue: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  status: ContentStatusSchema.default("DRAFT"),
});

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
      dateRange: undefined,
      status: "DRAFT",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      // Convert dateRange to startDate and endDate for API compatibility
      const apiData: any = {
        ...values,
        startDate: values.dateRange?.from,
        endDate: values.dateRange?.to,
      };
      delete apiData.dateRange;

      // Clean up empty strings to avoid validation issues
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "") {
          delete apiData[key];
        }
      });

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });
      if (!res.ok) throw new Error("Error al guardar el evento");
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

      <EventDateRangePicker
        control={form.control}
        name="dateRange"
        label="Período del Evento"
        placeholder="Seleccionar período del evento"
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
