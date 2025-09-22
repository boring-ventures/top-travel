"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DestinationCreateInput,
  DestinationCreateSchema,
  DestinationUpdateInput,
} from "@/lib/validations/destination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { PdfUpload } from "@/components/ui/pdf-upload";
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
import { useToast } from "@/components/ui/use-toast";
import { uploadDestinationImage } from "@/lib/supabase/storage";
import {
  Check,
  ChevronsUpDown,
  X,
  Tag,
  Star,
  FileText,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DestinationFormProps = {
  onSuccess?: () => void;
  initialValues?: Partial<DestinationUpdateInput & { id: string }>;
};

export function DestinationForm({
  onSuccess,
  initialValues,
}: DestinationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<any[]>([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async (
    pdfUrl: string,
    destinationTitle: string
  ) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${destinationTitle}-documento.pdf`;
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

  // Fetch tags data
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        setTags(data ?? []);
      } catch {
        // no-op
      }
    })();
  }, []);

  const form = useForm<DestinationCreateInput>({
    resolver: zodResolver(DestinationCreateSchema),
    defaultValues: {
      slug: "",
      country: "",
      city: "",
      description: "",
      heroImageUrl: undefined,
      pdfUrl: undefined,
      isFeatured: false,
      tagIds: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues) {
      // Extract tagIds from destinationTags relationship
      const tagIds =
        (initialValues as any).destinationTags?.map((dt: any) => dt.tagId) ||
        [];

      form.reset({
        slug: (initialValues as any).slug ?? "",
        country: (initialValues as any).country ?? "",
        city: (initialValues as any).city ?? "",
        description: (initialValues as any).description ?? "",
        heroImageUrl: (initialValues as any).heroImageUrl ?? undefined,
        pdfUrl: (initialValues as any).pdfUrl ?? undefined,
        isFeatured: Boolean((initialValues as any).isFeatured) ?? false,
        tagIds: tagIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const selectedTagIds = form.watch("tagIds") || [];
  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let finalHeroImageUrl = values.heroImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        const slug = values.slug || "temp";
        finalHeroImageUrl = await uploadDestinationImage(
          selectedImageFile,
          slug
        );
      }

      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/destinations/${(initialValues as any).id}`
        : "/api/destinations";
      const method = isEdit ? "PATCH" : "POST";

      // Clean up empty strings to avoid validation issues
      const apiData: any = {
        ...values,
        heroImageUrl: finalHeroImageUrl || undefined,
      };
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "" || apiData[key] === null) {
          delete apiData[key];
        }
      });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
        title: isEdit ? "Destino actualizado" : "Destino creado",
        description: isEdit
          ? "El destino se ha actualizado correctamente."
          : "El destino se ha creado correctamente.",
      });

      onSuccess?.();
      if (!isEdit) form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar el destino",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="ciudad-pais"
            className="w-full"
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-red-600">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País *</Label>
          <Input
            id="country"
            {...form.register("country")}
            placeholder="Nombre del país"
            className="w-full"
          />
          {form.formState.errors.country && (
            <p className="text-sm text-red-600">
              {form.formState.errors.country.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            {...form.register("city")}
            placeholder="Nombre de la ciudad"
            className="w-full"
          />
          {form.formState.errors.city && (
            <p className="text-sm text-red-600">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          rows={3}
          placeholder="Descripción breve del destino"
          className="w-full"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Imagen Principal</Label>
        <ImageUpload
          value={form.watch("heroImageUrl")}
          onChange={(url) => form.setValue("heroImageUrl", url)}
          onFileSelect={(file) => setSelectedImageFile(file)}
          deferred={true}
          placeholder="Imagen Principal del Destino"
          aspectRatio={3 / 2}
        />
        {form.formState.errors.heroImageUrl && (
          <p className="text-sm text-red-600">
            {form.formState.errors.heroImageUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <PdfUpload
          value={form.watch("pdfUrl")}
          onChange={(url) => form.setValue("pdfUrl", url)}
          onFileSelect={(file) => setSelectedPdfFile(file)}
          placeholder="Subir documento PDF del destino"
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
                    const city = form.watch("city") || "destino";
                    if (pdfUrl) {
                      handleDownloadPdf(pdfUrl, city);
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

      <div className="space-y-2">
        <Label>Etiquetas</Label>
        <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={tagsOpen}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>
                  {selectedTags.length > 0
                    ? `${selectedTags.length} etiqueta${selectedTags.length !== 1 ? "s" : ""} seleccionada${selectedTags.length !== 1 ? "s" : ""}`
                    : "Seleccionar etiquetas..."}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar etiquetas..." />
              <CommandList>
                <CommandEmpty>No se encontraron etiquetas.</CommandEmpty>
                <CommandGroup>
                  <div
                    className="max-h-64 overflow-y-auto"
                    onWheel={(e) => {
                      e.stopPropagation();
                      const target = e.currentTarget;
                      const scrollTop = target.scrollTop;
                      const scrollHeight = target.scrollHeight;
                      const clientHeight = target.clientHeight;

                      if (
                        e.deltaY > 0 &&
                        scrollTop + clientHeight >= scrollHeight
                      ) {
                        e.preventDefault();
                      } else if (e.deltaY < 0 && scrollTop <= 0) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {tags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={`${tag.name} ${tag.type}`}
                        onSelect={() => {
                          const currentIds = form.getValues("tagIds") || [];
                          const isSelected = currentIds.includes(tag.id);

                          if (isSelected) {
                            form.setValue(
                              "tagIds",
                              currentIds.filter((id) => id !== tag.id)
                            );
                          } else {
                            form.setValue("tagIds", [...currentIds, tag.id]);
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTagIds.includes(tag.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{tag.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {tag.type}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
                <span className="text-xs text-muted-foreground">
                  ({tag.type})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentIds = form.getValues("tagIds") || [];
                    form.setValue(
                      "tagIds",
                      currentIds.filter((id) => id !== tag.id)
                    );
                  }}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFeatured"
          {...form.register("isFeatured")}
          className="rounded border-gray-300"
        />
        <Label
          htmlFor="isFeatured"
          className="text-sm font-medium flex items-center gap-2"
        >
          <Star className="h-4 w-4" />
          Destino destacado
        </Label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Estado:</span>
          <Badge variant="outline">
            {form.watch("isFeatured") ? "Destacado" : "Normal"}
          </Badge>
        </div>

        <Button type="submit" disabled={submitting} className="min-w-[120px]">
          {submitting
            ? "Guardando..."
            : initialValues?.id
              ? "Actualizar Destino"
              : "Crear Destino"}
        </Button>
      </div>
    </form>
  );
}
