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
  const { toast } = useToast();

  const form = useForm<WeddingDestinationCreate>({
    resolver: zodResolver(WeddingDestinationCreateSchema),
    defaultValues: {
      slug: "",
      name: "",
      title: "",
      description: "",
      heroImageUrl: "",
      gallery: [],
      isFeatured: false,
    },
  });

  const onSubmit = async (data: WeddingDestinationCreate) => {
    setIsLoading(true);
    try {
      await api.post("/api/wedding-destinations", data);
      toast({
        title: "Destino creado",
        description: "El destino de boda ha sido creado exitosamente.",
      });
      form.reset();
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Destino de Boda</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo destino de boda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descripción del destino..."
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroImageUrl">URL de Imagen Principal</Label>
            <Input
              id="heroImageUrl"
              {...form.register("heroImageUrl")}
              placeholder="https://example.com/image.jpg"
            />
            {form.formState.errors.heroImageUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.heroImageUrl.message}
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
