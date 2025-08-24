"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPostUpdateSchema } from "@/lib/validations/blog-post";
import type { BlogPostUpdate } from "@/lib/validations/blog-post";
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

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  heroImageUrl?: string;
  author?: string;
  publishedAt?: string;
  status: "DRAFT" | "PUBLISHED";
  type: "WEDDINGS" | "QUINCEANERA";
  createdAt: string;
  updatedAt: string;
}

interface EditBlogPostModalProps {
  post: BlogPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditBlogPostModal({
  post,
  open,
  onOpenChange,
  onSuccess,
}: EditBlogPostModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BlogPostUpdate>({
    resolver: zodResolver(BlogPostUpdateSchema),
    defaultValues: {
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      heroImageUrl: post.heroImageUrl || "",
      author: post.author || "",
      status: post.status,
      type: post.type,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        heroImageUrl: post.heroImageUrl || "",
        author: post.author || "",
        status: post.status,
        type: post.type,
      });
    }
  }, [open, post, form]);

  const onSubmit = async (data: BlogPostUpdate) => {
    setIsLoading(true);
    try {
      await api.put(`/api/blog-posts/${post.slug}`, data);
      toast({
        title: "Post actualizado",
        description: "El blog post ha sido actualizado exitosamente.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "No se pudo actualizar el blog post.",
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
          <DialogTitle>Editar Blog Post</DialogTitle>
          <DialogDescription>
            Modifica la información del blog post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="mi-primer-post"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                {...form.register("author")}
                placeholder="Tu nombre"
              />
              {form.formState.errors.author && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.author.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Título del blog post"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumen</Label>
            <Textarea
              id="excerpt"
              {...form.register("excerpt")}
              placeholder="Breve descripción del post..."
              rows={2}
            />
            {form.formState.errors.excerpt && (
              <p className="text-sm text-destructive">
                {form.formState.errors.excerpt.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido *</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              placeholder="Contenido del blog post..."
              rows={8}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroImageUrl">URL de Imagen Destacada</Label>
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
              id="status"
              checked={form.watch("status") === "PUBLISHED"}
              onCheckedChange={(checked) =>
                form.setValue("status", checked ? "PUBLISHED" : "DRAFT")
              }
            />
            <Label htmlFor="status">Publicado</Label>
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
              {isLoading ? "Actualizando..." : "Actualizar Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
