"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OfferCreateSchema,
  OfferCreateInput,
  OfferUpdateInput,
} from "@/lib/validations/offer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { OfferDateRangePicker } from "./offer-date-range-picker";
import { useState, useEffect } from "react";
import { uploadImageToStorage } from "@/lib/supabase/upload-image";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  ContentStatusSchema,
  NonEmptyStringSchema,
  URLStringSchema,
} from "@/lib/validations/common";

// Custom schema for the form that includes dateRange
const OfferFormSchema = z.object({
  title: NonEmptyStringSchema,
  subtitle: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  status: ContentStatusSchema.default("DRAFT"),
  packageId: z.string().optional(),
  externalUrl: z.string().optional(),
});

type OfferFormInput = z.infer<typeof OfferFormSchema>;

interface OfferFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<OfferUpdateInput & { id: string }>;
}

export function OfferForm({ onSuccess, initialValues }: OfferFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  console.log("OfferForm rendered with initialValues:", initialValues);

  const form = useForm<OfferFormInput>({
    resolver: zodResolver(OfferFormSchema),
    defaultValues: { title: "", isFeatured: false, status: "DRAFT" },
    mode: "onChange", // Enable real-time validation
  });

  useEffect(() => {
    if (initialValues) {
      const dateRange: DateRange | undefined =
        (initialValues as any).startAt || (initialValues as any).endAt
          ? {
              from: (initialValues as any).startAt
                ? new Date((initialValues as any).startAt)
                : undefined,
              to: (initialValues as any).endAt
                ? new Date((initialValues as any).endAt)
                : undefined,
            }
          : undefined;

      form.reset({
        title: (initialValues as any).title ?? "",
        subtitle: (initialValues as any).subtitle ?? "",
        bannerImageUrl: (initialValues as any).bannerImageUrl ?? "",
        isFeatured: Boolean((initialValues as any).isFeatured) ?? false,
        status: (initialValues as any).status ?? "DRAFT",
        dateRange,
        packageId: (initialValues as any).packageId ?? "",
        externalUrl: (initialValues as any).externalUrl ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("=== FORM SUBMISSION START ===");
    console.log("Form submitted with values:", values);
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
    console.log("Initial values:", initialValues);
    setSubmitting(true);
    try {
      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/offers/${(initialValues as any).id}`
        : "/api/offers";
      const method = isEdit ? "PATCH" : "POST";

      // Convert dateRange to startAt and endAt for API compatibility
      const apiData: any = {
        ...values,
        startAt: values.dateRange?.from,
        endAt: values.dateRange?.to,
      };
      delete apiData.dateRange;

      // Clean up empty strings to avoid validation issues
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "") {
          delete apiData[key];
        }
      });

      console.log("Sending API request:", { url, method, apiData });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(apiData),
      });

      console.log("API response status:", res.status);
      console.log("API response headers:", res.headers);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await res.json();
      console.log("API success:", result);
      console.log("=== FORM SUBMISSION END ===");

      toast({
        title: isEdit ? "Oferta actualizada" : "Oferta creada",
        description: isEdit
          ? "La oferta se ha actualizado correctamente."
          : "La oferta se ha creado correctamente.",
      });

      onSuccess?.();
      if (!isEdit) form.reset();
    } catch (error) {
      console.error("=== FORM SUBMISSION ERROR ===");
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al guardar la oferta",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Título de la oferta"
            className="w-full"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <select
            id="status"
            value={form.watch("status")}
            onChange={(e) =>
              form.setValue("status", e.target.value as "DRAFT" | "PUBLISHED")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          {...form.register("subtitle")}
          placeholder="Subtítulo descriptivo"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bannerImageUrl">URL de Imagen de Banner</Label>
        <Input
          id="bannerImageUrl"
          {...form.register("bannerImageUrl")}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Ingresa la URL de una imagen para mostrar como banner de la oferta
        </p>
      </div>

      <OfferDateRangePicker
        control={form.control}
        name="dateRange"
        label="Período de la Oferta"
        placeholder="Seleccionar período de la oferta"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFeatured"
          {...form.register("isFeatured")}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isFeatured" className="text-sm font-medium">
          Marcar como oferta destacada
        </Label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Estado actual:</span>
          <Badge variant="outline">
            {form.watch("status") === "PUBLISHED" ? "Publicado" : "Borrador"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("Test button clicked");
              console.log("Current form values:", form.getValues());
              console.log("Form is valid:", form.formState.isValid);
              console.log("Form errors:", form.formState.errors);
              console.log("Form touched fields:", form.formState.touchedFields);
            }}
          >
            Debug Form
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting
              ? "Guardando..."
              : initialValues?.id
                ? "Actualizar"
                : "Crear"}
          </Button>
        </div>
      </div>
    </form>
  );
}
