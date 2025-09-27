"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuinceaneraDestinationUpdateSchema } from "@/lib/validations/quinceanera-destination";
import type { QuinceaneraDestinationUpdate } from "@/lib/validations/quinceanera-destination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { ImageUpload } from "@/components/ui/image-upload";
import { GalleryInput } from "@/components/ui/gallery-input";
import { uploadQuinceaneraDestinationImage } from "@/lib/supabase/storage";

interface QuinceaneraDestination {
  id: string;
  slug: string;
  name: string;
  title: string;
  summary?: string;
  description?: string;
  heroImageUrl?: string;
  gallery?: string[];
  location?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditQuinceaneraDestinationModalProps {
  destination: QuinceaneraDestination;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditQuinceaneraDestinationModal({
  destination,
  open,
  onOpenChange,
  onSuccess,
}: EditQuinceaneraDestinationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<QuinceaneraDestinationUpdate>({
    resolver: zodResolver(QuinceaneraDestinationUpdateSchema),
    defaultValues: {
      slug: destination.slug,
      name: destination.name,
      title: destination.title,
      summary: destination.summary || "",
      description: destination.description || "",
      heroImageUrl: destination.heroImageUrl || "",
      gallery: destination.gallery || [],
      location: destination.location || "",
      isFeatured: destination.isFeatured,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        slug: destination.slug,
        name: destination.name,
        title: destination.title,
        summary: destination.summary || "",
        description: destination.description || "",
        heroImageUrl: destination.heroImageUrl || "",
        gallery: destination.gallery || [],
        location: destination.location || "",
        isFeatured: destination.isFeatured,
      });
    }
  }, [open, destination, form]);

  const onSubmit = async (data: QuinceaneraDestinationUpdate) => {
    setIsLoading(true);
    try {
      let finalData = { ...data };

      // Upload hero image if provided
      if (heroImageFile) {
        const heroImageUrl = await uploadQuinceaneraDestinationImage(
          heroImageFile,
          destination.slug
        );
        finalData.heroImageUrl = heroImageUrl;
      }

      // Upload gallery images if provided
      if (galleryFiles.length > 0) {
        const galleryUrls = await Promise.all(
          galleryFiles.map((file) =>
            uploadQuinceaneraDestinationImage(file, destination.slug)
          )
        );
        finalData.gallery = [...(data.gallery || []), ...galleryUrls];
      }

      await api.put(
        `/api/quinceanera-destinations/${destination.slug}`,
        finalData
      );
      toast({
        title: "Destino actualizado",
        description:
          "El destino de quinceañera ha sido actualizado exitosamente.",
      });
      setHeroImageFile(null);
      setGalleryFiles([]);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "No se pudo actualizar el destino de quinceañera.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Destino de Quinceañera</DialogTitle>
          <DialogDescription>
            Modifica la información del destino de quinceañera.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...form.register("slug")}
                  placeholder="quinceaneras-paris"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="París"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Quinceañeras en París"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              {...form.register("location")}
              placeholder="París, Francia"
            />
            {form.formState.errors.location && (
              <p className="text-sm text-destructive">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Resumen</Label>
            <Textarea
              id="summary"
              {...form.register("summary")}
              placeholder="Breve descripción para tarjetas..."
              rows={2}
            />
            {form.formState.errors.summary && (
              <p className="text-sm text-destructive">
                {form.formState.errors.summary.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Completa</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descripción detallada del destino..."
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagen Principal</Label>
            <ImageUpload
              value={form.watch("heroImageUrl")}
              onChange={(url) => form.setValue("heroImageUrl", url)}
              onFileSelect={setHeroImageFile}
              placeholder="Subir imagen principal"
              aspectRatio={16 / 9}
              deferred={true}
            />
            {form.formState.errors.heroImageUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.heroImageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Galería de Imágenes</Label>
            <GalleryInput
              value={form.watch("gallery") || []}
              onChange={(urls) => form.setValue("gallery", urls)}
              onFileSelect={setGalleryFiles}
              placeholder="Subir imágenes para la galería"
              aspectRatio={16 / 9}
              maxImages={10}
              deferred={true}
            />
            {form.formState.errors.gallery && (
              <p className="text-sm text-destructive">
                {form.formState.errors.gallery.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={form.watch("isFeatured")}
              onCheckedChange={(checked) =>
                form.setValue("isFeatured", checked)
              }
            />
            <Label htmlFor="isFeatured">Destacado</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Destino"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
