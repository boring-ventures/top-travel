"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FixedDepartureUpdateInput,
  FixedDepartureUpdateSchema,
} from "@/lib/validations/fixed-departure";
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
import { Loader2, Edit, Check, ChevronsUpDown, FileText, ExternalLink } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { PdfUpload } from "@/components/ui/pdf-upload";
import { AmenitiesInput } from "@/components/ui/amenities-input";
import { uploadFixedDepartureImage } from "@/lib/supabase/storage";
import { FixedDepartureDateRangePicker } from "@/components/admin/forms/fixed-departure-date-range-picker";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  ContentStatusSchema,
  NonEmptyStringSchema,
  SlugSchema,
} from "@/lib/validations/common";

// Custom schema for the form that includes dateRange
const FixedDepartureFormSchema = z.object({
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  destinationId: z.string(),
  heroImageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
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

interface EditFixedDepartureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedDepartureSlug: string | null;
}

export function EditFixedDepartureModal({
  open,
  onOpenChange,
  fixedDepartureSlug,
}: EditFixedDepartureModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fixedDeparture, setFixedDeparture] = useState<any>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FixedDepartureFormInput>({
    resolver: zodResolver(FixedDepartureFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      destinationId: "",
      heroImageUrl: "",
      pdfUrl: undefined,
      amenities: [],
      exclusions: [],
      dateRange: undefined,
      detailsJson: undefined,
      seatsInfo: "",
      status: "DRAFT",
    },
  });

  // Fetch destinations when modal opens
  useEffect(() => {
    if (open) {
      fetch("/api/destinations")
        .then((res) => res.json())
        .then((data) => {
          setDestinations(data.items ?? data ?? []);
        })
        .catch(() => {
          setDestinations([]);
        });
    }
  }, [open]);

  // Fetch fixed departure data when modal opens
  useEffect(() => {
    if (open && fixedDepartureSlug) {
      setLoading(true);
      fetch(`/api/fixed-departures/${fixedDepartureSlug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar la salida fija");
          return res.json();
        })
        .then((data) => {
          setFixedDeparture(data);
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
            destinationId: data.destinationId || "",
            heroImageUrl: data.heroImageUrl || "",
            pdfUrl: data.pdfUrl || undefined,
            amenities: data.amenities || [],
            exclusions: data.exclusions || [],
            dateRange,
            detailsJson: data.detailsJson,
            seatsInfo: data.seatsInfo || "",
            status: data.status,
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar la salida fija",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, fixedDepartureSlug, form, toast, onOpenChange]);

  const handleDownloadPdf = async (pdfUrl: string, departureTitle: string) => {
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${departureTitle}-documento.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      window.open(pdfUrl, "_blank");
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!fixedDepartureSlug) return;

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

      const res = await fetch(`/api/fixed-departures/${fixedDepartureSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar la salida fija");
      }

      toast({
        title: "Salida fija actualizada",
        description: "La salida fija se ha actualizado exitosamente.",
      });

      // Refresh the fixed departures list
      queryClient.invalidateQueries({ queryKey: ["cms", "fixed-departures"] });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la salida fija",
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
            Editar Salida Fija
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando salida fija...</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FixedDepartureDateRangePicker
                control={form.control}
                name="dateRange"
                label="Período del Viaje"
                placeholder="Seleccionar período del viaje"
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

            <div className="space-y-2">
              <Label>Imagen Principal</Label>
              <ImageUpload
                value={form.watch("heroImageUrl")}
                onChange={(url) => form.setValue("heroImageUrl", url)}
                onUpload={async (file) => {
                  const slug = form.watch("slug") || "temp";
                  return uploadFixedDepartureImage(file, slug);
                }}
                placeholder="Imagen Principal de la Salida Fija"
                aspectRatio={16 / 9}
              />
            </div>

            <div className="space-y-2">
              <PdfUpload
                value={form.watch("pdfUrl")}
                onChange={(url) => form.setValue("pdfUrl", url)}
                onFileSelect={(file) => setSelectedPdfFile(file)}
                placeholder="Subir documento PDF de la salida fija"
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
                          const title = form.watch("title") || "salida fija";
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
                  "Actualizar Salida Fija"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
