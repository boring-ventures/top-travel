"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventUpdateInput, EventUpdateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Edit, Check, ChevronsUpDown } from "lucide-react";
import { EventDateRangePicker } from "@/components/admin/forms/event-date-range-picker";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { cn } from "@/lib/utils";
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

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventSlug: string | null;
}

export function EditEventModal({
  open,
  onOpenChange,
  eventSlug,
}: EditEventModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [statusOpen, setStatusOpen] = useState(false);
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

  // Fetch event data when modal opens
  useEffect(() => {
    if (open && eventSlug) {
      setLoading(true);
      fetch(`/api/events/${eventSlug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el evento");
          return res.json();
        })
        .then((data) => {
          setEvent(data);
          // Pre-populate form with existing data
          const dateRange: DateRange | undefined =
            data.startDate || data.endDate
              ? {
                  from: data.startDate ? new Date(data.startDate) : undefined,
                  to: data.endDate ? new Date(data.endDate) : undefined,
                }
              : undefined;

          form.reset({
            slug: data.slug,
            title: data.title,
            artistOrEvent: data.artistOrEvent,
            locationCity: data.locationCity || "",
            locationCountry: data.locationCountry || "",
            venue: data.venue || "",
            dateRange,
            status: data.status,
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar el evento",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, eventSlug, form, toast, onOpenChange]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!eventSlug) return;

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

      const res = await fetch(`/api/events/${eventSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar el evento");
      }

      toast({
        title: "Evento actualizado",
        description: "El evento se ha actualizado exitosamente.",
      });

      // Refresh the events list
      queryClient.invalidateQueries({ queryKey: ["cms", "events"] });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el evento",
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
            <Edit className="h-5 w-5" />
            Editar Evento
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando evento...</span>
            </div>
          </div>
        ) : (
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
                  className={
                    form.formState.errors.title ? "border-red-500" : ""
                  }
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
              <EventDateRangePicker
                control={form.control}
                name="dateRange"
                label="Período del Evento"
                placeholder="Seleccionar período del evento"
              />

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={statusOpen}
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            form.watch("status") === "DRAFT"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          )}
                        />
                        <span className="text-sm">
                          {form.watch("status") === "PUBLISHED"
                            ? "Publicado"
                            : "Borrador"}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar estado..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron estados.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="DRAFT"
                            onSelect={() => {
                              form.setValue("status", "DRAFT");
                              setStatusOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch("status") === "DRAFT"
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                              <span>Borrador</span>
                            </div>
                          </CommandItem>
                          <CommandItem
                            value="PUBLISHED"
                            onSelect={() => {
                              form.setValue("status", "PUBLISHED");
                              setStatusOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch("status") === "PUBLISHED"
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span>Publicado</span>
                            </div>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
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
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Evento"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
