"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TagCreateInput,
  TagCreateSchema,
  TagUpdateInput,
} from "@/lib/validations/tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type TagFormProps = {
  onSuccess?: () => void;
  initialValues?: Partial<TagUpdateInput & { id: string }>;
};

export function TagForm({ onSuccess, initialValues }: TagFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TagCreateInput>({
    resolver: zodResolver(TagCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "REGION",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: (initialValues as any).name ?? "",
        slug: (initialValues as any).slug ?? "",
        type: (initialValues as any).type ?? "REGION",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/tags/${(initialValues as any).id}`
        : "/api/tags";
      const method = isEdit ? "PATCH" : "POST";

      // Clean up empty strings to avoid validation issues
      const apiData = { ...values };
      Object.keys(apiData).forEach((key) => {
        if (apiData[key as keyof typeof apiData] === "") {
          delete apiData[key as keyof typeof apiData];
        }
      });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar la etiqueta");
      }

      toast({
        title: isEdit ? "Etiqueta actualizada" : "Etiqueta creada",
        description: isEdit
          ? "La etiqueta se ha actualizado exitosamente."
          : "La etiqueta se ha creado exitosamente.",
      });

      onSuccess?.();
      if (!isEdit) {
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar la etiqueta",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "REGION":
        return "Región";
      case "THEME":
        return "Tema";
      case "DEPARTMENT":
        return "Departamento";
      default:
        return type;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Playa del Carmen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="playa-del-carmen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="REGION">
                      {getTypeLabel("REGION")}
                    </SelectItem>
                    <SelectItem value="THEME">
                      {getTypeLabel("THEME")}
                    </SelectItem>
                    <SelectItem value="DEPARTMENT">
                      {getTypeLabel("DEPARTMENT")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Etiqueta"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
