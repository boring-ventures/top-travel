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
import { ImageUpload } from "@/components/ui/image-upload";
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
import { OfferDateRangePicker } from "./offer-date-range-picker";
import { useState, useEffect } from "react";
import { uploadOfferImage } from "@/lib/supabase/storage";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  tagIds: z.array(z.string()).optional(),
});

type OfferFormInput = z.infer<typeof OfferFormSchema>;

interface OfferFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<OfferUpdateInput & { id: string }>;
}

// Custom hook to fetch tags
const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await fetch("/api/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      return res.json();
    },
  });
};

export function OfferForm({ onSuccess, initialValues }: OfferFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { data: tags, isLoading: tagsLoading } = useTags();

  const form = useForm<OfferFormInput>({
    resolver: zodResolver(OfferFormSchema),
    defaultValues: {
      title: "",
      isFeatured: false,
      status: "DRAFT",
      tagIds: [],
    },
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
        tagIds: (initialValues as any).tagIds ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let finalBannerImageUrl = values.bannerImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        const offerId = (initialValues as any)?.id || "temp";
        finalBannerImageUrl = await uploadOfferImage(
          selectedImageFile,
          offerId
        );
      }

      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/offers/${(initialValues as any).id}`
        : "/api/offers";
      const method = isEdit ? "PATCH" : "POST";

      // Convert dateRange to startAt and endAt for API compatibility
      const apiData: any = {
        ...values,
        bannerImageUrl: finalBannerImageUrl,
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await res.json();

      // Clear the selected file after successful submission
      setSelectedImageFile(null);

      toast({
        title: isEdit ? "Oferta actualizada" : "Oferta creada",
        description: isEdit
          ? "La oferta se ha actualizado correctamente."
          : "La oferta se ha creado correctamente.",
      });

      onSuccess?.();
      if (!isEdit) form.reset();
    } catch (error) {
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
          <Label>Estado</Label>
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
                      form.watch("status") === "PUBLISHED"
                        ? "bg-green-500"
                        : "bg-yellow-500"
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
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          {...form.register("subtitle")}
          placeholder="Subtítulo descriptivo"
          className="w-full"
        />
      </div>

      <TagsInput
        value={form.watch("tagIds") || []}
        onChange={(value) => form.setValue("tagIds", value)}
        label="Etiquetas"
        placeholder="Seleccionar etiquetas..."
      />

      <div className="space-y-2">
        <Label htmlFor="bannerImageUrl">Imagen de Banner</Label>
        <ImageUpload
          value={form.watch("bannerImageUrl")}
          onChange={(url) => form.setValue("bannerImageUrl", url)}
          onFileSelect={(file) => setSelectedImageFile(file)}
          deferred={true}
          placeholder="Imagen de Banner de la Oferta"
          aspectRatio={2 / 1}
        />
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
