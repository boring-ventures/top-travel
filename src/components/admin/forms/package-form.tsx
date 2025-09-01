"use client";

import { useEffect, useState, useRef } from "react";
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
import { AmenitiesInput } from "@/components/ui/amenities-input";
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
import { uploadPackageImage } from "@/lib/supabase/storage";
import { Check, ChevronsUpDown, X, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<PackageUpdateInput & { id: string; slug: string }>;
}

export function PackageForm({ onSuccess, initialValues }: PackageFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const { toast } = useToast();

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
  }, [initialValues, form]);

  const selectedDestinationIds = form.watch("destinationIds") || [];
  const selectedDestinations = destinations.filter((d) =>
    selectedDestinationIds.includes(d.id)
  );

  const selectedTagIds = form.watch("tagIds") || [];
  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      let finalHeroImageUrl = values.heroImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        const slug = values.slug || "temp";
        finalHeroImageUrl = await uploadPackageImage(selectedImageFile, slug);
      }

      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/packages/${(initialValues as any).slug}`
        : "/api/packages";
      const method = isEdit ? "PATCH" : "POST";

      // Clean up empty strings to avoid validation issues
      const apiData: any = {
        ...values,
        heroImageUrl: finalHeroImageUrl,
      };
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "") {
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
        title: isEdit ? "Paquete actualizado" : "Paquete creado",
        description: isEdit
          ? "El paquete se ha actualizado correctamente."
          : "El paquete se ha creado correctamente.",
      });

      onSuccess?.();
      if (!isEdit) form.reset();
    } catch (error) {
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
          onFileSelect={(file) => setSelectedImageFile(file)}
          deferred={true}
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
          <Label>Moneda</Label>
          <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={currencyOpen}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {form.watch("currency") === "BOB"
                      ? "BOB - Boliviano"
                      : form.watch("currency") === "USD"
                        ? "USD - Dólar Estadounidense"
                        : "Seleccionar moneda"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar moneda..." />
                <CommandList>
                  <CommandEmpty>No se encontraron monedas.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value=""
                      onSelect={() => {
                        form.setValue("currency", undefined);
                        setCurrencyOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !form.watch("currency") ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Sin moneda
                    </CommandItem>
                    <CommandItem
                      value="BOB"
                      onSelect={() => {
                        form.setValue("currency", "BOB");
                        setCurrencyOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.watch("currency") === "BOB"
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      BOB - Boliviano
                    </CommandItem>
                    <CommandItem
                      value="USD"
                      onSelect={() => {
                        form.setValue("currency", "USD");
                        setCurrencyOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.watch("currency") === "USD"
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      USD - Dólar Estadounidense
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Destinos</Label>
          <Popover open={destinationsOpen} onOpenChange={setDestinationsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={destinationsOpen}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {selectedDestinations.length > 0
                      ? `${selectedDestinations.length} destino${selectedDestinations.length !== 1 ? "s" : ""} seleccionado${selectedDestinations.length !== 1 ? "s" : ""}`
                      : "Seleccionar destinos..."}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar destinos..." />
                <CommandList>
                  <CommandEmpty>No se encontraron destinos.</CommandEmpty>
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
                      {destinations.map((destination) => (
                        <CommandItem
                          key={destination.id}
                          value={`${destination.city} ${destination.country}`}
                          onSelect={() => {
                            const currentIds =
                              form.getValues("destinationIds") || [];
                            const isSelected = currentIds.includes(
                              destination.id
                            );

                            if (isSelected) {
                              form.setValue(
                                "destinationIds",
                                currentIds.filter((id) => id !== destination.id)
                              );
                            } else {
                              form.setValue("destinationIds", [
                                ...currentIds,
                                destination.id,
                              ]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDestinationIds.includes(destination.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {destination.city}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {destination.country}
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

          {/* Selected Destinations Display */}
          {selectedDestinations.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDestinations.map((destination) => (
                <Badge
                  key={destination.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  {destination.city}, {destination.country}
                  <button
                    type="button"
                    onClick={() => {
                      const currentIds = form.getValues("destinationIds") || [];
                      form.setValue(
                        "destinationIds",
                        currentIds.filter((id) => id !== destination.id)
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

      <AmenitiesInput
        label="Incluye"
        value={form.watch("inclusions") || []}
        onChange={(value) => form.setValue("inclusions", value)}
        placeholder="Ej: Hotel, Transporte, Guía, Comidas..."
      />

      <AmenitiesInput
        label="No Incluye"
        value={form.watch("exclusions") || []}
        onChange={(value) => form.setValue("exclusions", value)}
        placeholder="Ej: Vuelos, Propinas, Gastos personales..."
      />

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
              // Debug form state (logs removed for production)
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
