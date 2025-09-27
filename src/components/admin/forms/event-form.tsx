"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateInput, EventCreateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { PdfUpload } from "@/components/ui/pdf-upload";
import { AmenitiesInput } from "@/components/ui/amenities-input";
import { TagsInput } from "@/components/ui/tags-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState, useEffect } from "react";
import {
  Loader2,
  FileText,
  ExternalLink,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [destinations, setDestinations] = useState<any[]>([]);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetch("/api/destinations").then((r) => r.json());
        setDestinations(d.items ?? d ?? []);
      } catch {}
    })();
  }, []);

  const handleDownloadPdf = async (pdfUrl: string, eventTitle: string) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${eventTitle}-documento.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Fallback: open in new tab
      window.open(pdfUrl, "_blank");
    }
  };
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
              className={form.formState.errors.category ? "border-red-500" : ""}
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
          <Popover open={destinationsOpen} onOpenChange={setDestinationsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={destinationsOpen}
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
                          setDestinationsOpen(false);
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

      <div className="space-y-2">
        <PdfUpload
          value={form.watch("pdfUrl")}
          onChange={(url) => form.setValue("pdfUrl", url)}
          onFileSelect={(file) => setSelectedPdfFile(file)}
          placeholder="Subir documento PDF del evento"
        />

        {/* Current PDF Display */}
        {form.watch("pdfUrl") && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Documento PDF actual
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Haz clic en "Ver PDF" para abrir el documento
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(form.watch("pdfUrl"), "_blank")}
                  className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ver PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const pdfUrl = form.watch("pdfUrl");
                    const title = form.watch("title") || "evento";
                    if (pdfUrl) {
                      handleDownloadPdf(pdfUrl, title);
                    }
                  }}
                  className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
                >
                  <FileText className="h-3 w-3" />
                  Descargar
                </Button>
              </div>
            </div>
          </div>
        )}
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
