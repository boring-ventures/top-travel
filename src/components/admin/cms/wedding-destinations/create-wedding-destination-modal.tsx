"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WeddingDestinationCreateSchema } from "@/lib/validations/wedding-destination";
import type { WeddingDestinationCreate } from "@/lib/validations/wedding-destination";
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
import { uploadWeddingDestinationImage } from "@/lib/supabase/storage";

interface CreateWeddingDestinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateWeddingDestinationModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateWeddingDestinationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<WeddingDestinationCreate>({
    resolver: zodResolver(WeddingDestinationCreateSchema),
    defaultValues: {
      slug: "",
      name: "",
      title: "",
      summary: "",
      description: "",
      heroImageUrl: "",
      gallery: [],
      location: "",
      isFeatured: false,
    },
  });

  const onSubmit = async (data: WeddingDestinationCreate) => {
    setIsLoading(true);
    try {
      let finalData = { ...data };

      // Upload hero image if provided
      if (heroImageFile) {
        const heroImageUrl = await uploadWeddingDestinationImage(
          heroImageFile,
          data.slug
        );
        finalData.heroImageUrl = heroImageUrl;
      }

      // Upload gallery images if provided
      if (galleryFiles.length > 0) {
        const galleryUrls = await Promise.all(
          galleryFiles.map((file) =>
            uploadWeddingDestinationImage(file, data.slug)
          )
        );
        finalData.gallery = [...(data.gallery || []), ...galleryUrls];
      }

      await api.post("/api/wedding-destinations", finalData);
      toast({
        title: "Destino creado",
        description: "El destino de boda ha sido creado exitosamente.",
      });
      form.reset();
      setHeroImageFile(null);
      setGalleryFiles([]);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "No se pudo crear el destino de boda.",
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
          <DialogTitle>Crear Nuevo Destino de Boda</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo destino de boda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="bodas-paris"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" {...form.register("name")} placeholder="París" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Bodas en París"
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
              {isLoading ? "Creando..." : "Crear Destino"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
