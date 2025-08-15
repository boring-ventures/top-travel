"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PageCreateInput,
  PageCreateSchema,
  PageUpdateInput,
} from "@/lib/validations/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type PageFormProps = {
  onSuccess?: () => void;
  // If provided, the form works in edit mode and PATCHes to /api/pages/[slug]
  initialValues?: Partial<PageUpdateInput & { slug: string }>;
};

export function PageForm({ onSuccess, initialValues }: PageFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<PageCreateInput>({
    resolver: zodResolver(PageCreateSchema),
    defaultValues: {
      slug: "",
      title: "",
      sectionsJson: null,
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        slug: initialValues.slug ?? "",
        title: initialValues.title ?? "",
        sectionsJson: initialValues.sectionsJson ?? null,
        status: initialValues.status ?? "DRAFT",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.slug]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean(initialValues?.slug);
      const url = isEdit ? `/api/pages/${initialValues?.slug}` : "/api/pages";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSuccess?.();
      if (!isEdit) {
        form.reset();
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="about"
                    {...field}
                    disabled={Boolean(initialValues?.slug)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Sobre Nosotros" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sectionsJson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder='{"sections": [{"type": "hero", "title": "Bienvenidos"}]}'
                  value={
                    field.value ? JSON.stringify(field.value, null, 2) : ""
                  }
                  onChange={(e) => {
                    try {
                      const parsed = e.target.value
                        ? JSON.parse(e.target.value)
                        : null;
                      field.onChange(parsed);
                    } catch {
                      // Invalid JSON, keep the raw value
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : initialValues?.slug ? (
              "Guardar Cambios"
            ) : (
              "Crear Página"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
