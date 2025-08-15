"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
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

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewEventModal({ open, onOpenChange }: NewEventModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear el evento");
      }

      toast({
        title: "Evento creado",
        description: "El evento se ha creado exitosamente.",
      });

      // Refresh the events list
      queryClient.invalidateQueries({ queryKey: ["cms", "events"] });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al crear el evento",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nuevo Evento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-2">
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Evento"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
