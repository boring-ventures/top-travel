"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, BlogPostInput } from "@/lib/validations/blog-post";
import { BlogPost, DepartmentType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateBlogPost } from "@/hooks/use-blog-posts";
import { ImageUpload } from "@/components/ui/image-upload";
import { uploadBlogPostImage } from "@/lib/supabase/storage";

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
  const { toast } = useToast();
  const updatePostMutation = useUpdateBlogPost();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
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

  const onSubmit = async (data: BlogPostInput) => {
    try {
      let heroImageUrl = data.heroImageUrl;

      // Upload new image if one was selected
      if (selectedImage) {
        const blogType =
          data.type === DepartmentType.WEDDINGS ? "weddings" : "quinceaneras";
        heroImageUrl = await uploadBlogPostImage(
          selectedImage,
          data.slug,
          blogType
        );
      }

      await updatePostMutation.mutateAsync({
        id: post.id,
        ...data,
        heroImageUrl,
      } as any);

      toast({
        title: "Post actualizado",
        description: "El blog post ha sido actualizado exitosamente.",
      });
      setSelectedImage(null);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el blog post.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Blog Post</DialogTitle>
          <DialogDescription>
            Modifica la información del blog post.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
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
              <Label>Imagen Destacada</Label>
              <ImageUpload
                value={form.watch("heroImageUrl")}
                onChange={(url) => form.setValue("heroImageUrl", url)}
                onFileSelect={(file) => setSelectedImage(file)}
                placeholder="Subir imagen destacada"
                deferred={true}
                maxSize={5}
                aspectRatio={1200 / 800}
              />
              {form.formState.errors.heroImageUrl && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.heroImageUrl.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Blog *</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value: DepartmentType) =>
                    form.setValue("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DepartmentType.WEDDINGS}>
                      Bodas
                    </SelectItem>
                    <SelectItem value={DepartmentType.QUINCEANERA}>
                      Quinceañeras
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="status"
                  checked={form.watch("status") === "PUBLISHED"}
                  onCheckedChange={(checked) =>
                    form.setValue("status", checked ? "PUBLISHED" : "DRAFT")
                  }
                />
                <Label htmlFor="status">Publicado</Label>
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updatePostMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updatePostMutation.isPending}>
                {updatePostMutation.isPending
                  ? "Actualizando..."
                  : "Actualizar Post"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
