"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PackageCreateInput,
  PackageCreateSchema,
  PackageUpdateInput,
} from "@/lib/validations/package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { uploadPackageImage } from "@/lib/supabase/storage";

interface PackageFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<PackageUpdateInput & { id: string; slug: string }>;
}

export function PackageForm({ onSuccess, initialValues }: PackageFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const { toast } = useToast();

  console.log("PackageForm rendered with initialValues:", initialValues);

  useEffect(() => {
    (async () => {
      try {
        const [d, t] = await Promise.all([
          fetch("/api/destinations").then((r) => r.json()),
          fetch("/api/tags").then((r) => r.json()),
        ]);
        setDestinations(d.items ?? d ?? []);
        setTags(t ?? []);
      } catch {
        // no-op
      }
    })();
  }, []);

  const form = useForm<PackageCreateInput>({
    resolver: zodResolver(PackageCreateSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      heroImageUrl: "",
      inclusions: [],
      exclusions: [],
      isCustom: false,
      status: "DRAFT",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        slug: (initialValues as any).slug ?? "",
        title: (initialValues as any).title ?? "",
        summary: (initialValues as any).summary ?? "",
        heroImageUrl: (initialValues as any).heroImageUrl ?? "",
        inclusions: (initialValues as any).inclusions ?? [],
        exclusions: (initialValues as any).exclusions ?? [],
        durationDays: (initialValues as any).durationDays ?? undefined,
        fromPrice: (initialValues as any).fromPrice ?? undefined,
        currency: (initialValues as any).currency ?? "",
        isCustom: Boolean((initialValues as any).isCustom) ?? false,
        status: (initialValues as any).status ?? "DRAFT",
        destinationIds:
          (initialValues as any).packageDestinations?.map(
            (d: any) => d.destination.id
          ) ?? [],
        tagIds:
          (initialValues as any).packageTags?.map((t: any) => t.tag.id) ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    console.log("=== PACKAGE FORM SUBMISSION START ===");
    console.log("Form submitted with values:", values);
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
    console.log("Initial values:", initialValues);
    setSubmitting(true);

    try {
      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/packages/${(initialValues as any).slug}`
        : "/api/packages";
      const method = isEdit ? "PATCH" : "POST";

      // Clean up empty strings to avoid validation issues
      const apiData: any = { ...values };
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "") {
          delete apiData[key];
        }
      });

      console.log("Sending API request:", { url, method, apiData });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      console.log("=== PACKAGE FORM SUBMISSION END ===");

      toast({
        title: isEdit ? "Paquete actualizado" : "Paquete creado",
        description: isEdit
          ? "El paquete se ha actualizado correctamente."
          : "El paquete se ha creado correctamente.",
      });

      onSuccess?.();
      if (!isEdit) form.reset();
    } catch (error) {
      console.error("=== PACKAGE FORM SUBMISSION ERROR ===");
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar el paquete",
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
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="unique-slug"
            className="w-full"
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-red-600">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Título del paquete"
            className="w-full"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Resumen</Label>
        <Textarea
          id="summary"
          {...form.register("summary")}
          placeholder="Resumen corto del paquete"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <ImageUpload
          value={form.watch("heroImageUrl")}
          onChange={(url) => form.setValue("heroImageUrl", url)}
          onUpload={async (file) => {
            const slug = form.watch("slug") || "temp";
            return uploadPackageImage(file, slug);
          }}
          placeholder="Imagen Principal del Paquete"
          aspectRatio={3 / 2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationDays">Duración (días)</Label>
          <Input
            id="durationDays"
            type="number"
            {...form.register("durationDays", { valueAsNumber: true })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromPrice">Precio desde</Label>
          <Input
            id="fromPrice"
            type="number"
            step="0.01"
            {...form.register("fromPrice", { valueAsNumber: true })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <select
            id="currency"
            {...form.register("currency")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-</option>
            <option value="BOB">BOB</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destinationIds">Destinos</Label>
          <select
            id="destinationIds"
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
            {...form.register("destinationIds")}
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.city}, {d.country}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples
            destinos
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagIds">Etiquetas</Label>
          <select
            id="tagIds"
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
            {...form.register("tagIds")}
          >
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples
            etiquetas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isCustom"
            {...form.register("isCustom")}
            className="rounded border-gray-300"
          />
          <Label htmlFor="isCustom" className="text-sm font-medium">
            Marcar como paquete personalizado
          </Label>
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
              console.log("Debug button clicked");
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
