"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventUpdateInput, EventUpdateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { AmenitiesInput } from "@/components/ui/amenities-input";
import { TagsInput } from "@/components/ui/tags-input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Edit, Check, ChevronsUpDown } from "lucide-react";
import { EventDateRangePicker } from "@/components/admin/forms/event-date-range-picker";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { uploadEventImage } from "@/lib/supabase/storage";

// Extended schema that includes dateRange for the form
const EventFormSchema = EventUpdateSchema.extend({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  tagIds: z.array(z.string()).optional(),
}).omit({ startDate: true, endDate: true });

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
  const [destinations, setDestinations] = useState<any[]>([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EventFormInput>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      artistOrEvent: "",
      category: undefined,
      destinationId: "",
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

  // Fetch destinations when modal opens
  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const d = await fetch("/api/destinations").then((r) => r.json());
          setDestinations(d.items ?? d ?? []);
        } catch {}
      })();
    }
  }, [open]);

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
            category: data.category,
            destinationId: data.destinationId || "",
            venue: data.venue || "",
            heroImageUrl: data.heroImageUrl || undefined,
            amenities: data.amenities || [],
            exclusions: data.exclusions || [],
            fromPrice: data.fromPrice ? Number(data.fromPrice) : undefined,
            currency: data.currency,
            detailsJson: data.detailsJson,
            gallery: data.gallery,
            dateRange,
            status: data.status,
            tagIds: data.tags?.map((tag: any) => tag.id) || [],
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
      const apiData: EventUpdateInput = {
        ...values,
        startDate: values.dateRange?.from?.toISOString(),
        endDate: values.dateRange?.to?.toISOString(),
        tagIds: values.tagIds,
      };

      // Remove the dateRange field as it's not part of the API schema
      delete (apiData as any).dateRange;

      // Clean up empty strings for other fields, but explicitly handle heroImageUrl
      Object.keys(apiData).forEach((key) => {
        if (
          apiData[key as keyof EventUpdateInput] === "" &&
          key !== "heroImageUrl"
        ) {
          delete apiData[key as keyof EventUpdateInput];
        }
      });

      // Explicitly ensure heroImageUrl is included
      apiData.heroImageUrl = values.heroImageUrl;

      const res = await fetch(`/api/events/${eventSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const error = await res.json();
        // API Error occurred
        throw new Error(error.error || "Error al actualizar el evento");
      }

      const result = await res.json();

      toast({
        title: "Evento actualizado",
        description: "El evento se ha actualizado exitosamente.",
      });

      // Refresh the events list
      queryClient.invalidateQueries({ queryKey: ["cms", "events"] });

      onOpenChange(false);
    } catch (error: any) {
      // Form submission error occurred
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={form.watch("category") || ""}
                  onValueChange={(value) =>
                    form.setValue(
                      "category",
                      value as "MUSIC" | "SPORTS" | "SPECIAL" | undefined
                    )
                  }
                >
                  <SelectTrigger
                    className={
                      form.formState.errors.category ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUSIC">Música</SelectItem>
                    <SelectItem value="SPORTS">Deportes</SelectItem>
                    <SelectItem value="SPECIAL">Especiales</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Destino</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {form.watch("destinationId")
                        ? destinations.find(
                            (destination) =>
                              destination.id === form.watch("destinationId")
                          )?.city +
                          ", " +
                          destinations.find(
                            (destination) =>
                              destination.id === form.watch("destinationId")
                          )?.country
                        : "Seleccionar destino..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar destino..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron destinos.</CommandEmpty>
                        <CommandGroup>
                          {destinations.map((destination) => (
                            <CommandItem
                              key={destination.id}
                              value={`${destination.city} ${destination.country}`}
                              onSelect={() => {
                                form.setValue("destinationId", destination.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.watch("destinationId") === destination.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {destination.city}, {destination.country}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onUpload={async (file) => {
                  const slug = form.watch("slug") || "temp";
                  const result = await uploadEventImage(file, slug);
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
