"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FixedDepartureCreateInput,
  FixedDepartureCreateSchema,
} from "@/lib/validations/fixed-departure";
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
import { FixedDepartureDateRangePicker } from "@/components/admin/forms/fixed-departure-date-range-picker";
import { DateRange } from "react-day-picker";
import { z } from "zod";
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

interface NewFixedDepartureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewFixedDepartureModal({
  open,
  onOpenChange,
}: NewFixedDepartureModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const form = useForm<FixedDepartureFormInput>({
    resolver: zodResolver(FixedDepartureFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      destinationId: "",
      dateRange: undefined,
      detailsJson: undefined,
      seatsInfo: "",
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

      const res = await fetch("/api/fixed-departures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear la salida fija");
      }

      toast({
        title: "Salida fija creada",
        description: "La salida fija se ha creado exitosamente.",
      });

      // Refresh the fixed departures list
      queryClient.invalidateQueries({ queryKey: ["cms", "fixed-departures"] });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al crear la salida fija",
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
            Nueva Salida Fija
          </DialogTitle>
        </DialogHeader>

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
                "Crear Salida Fija"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
