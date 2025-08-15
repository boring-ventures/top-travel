"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DepartmentCreateInput,
  DepartmentCreateSchema,
  DepartmentUpdateInput,
} from "@/lib/validations/department";
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

type DepartmentFormProps = {
  onSuccess?: () => void;
  // If provided, the form works in edit mode and PATCHes to /api/departments/[type]
  initialValues?: Partial<DepartmentUpdateInput & { type: string }>;
  disableType?: boolean;
};

export function DepartmentForm({
  onSuccess,
  initialValues,
  disableType,
}: DepartmentFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<DepartmentCreateInput>({
    resolver: zodResolver(DepartmentCreateSchema),
    defaultValues: {
      type: "WEDDINGS",
      title: "",
      intro: "",
      heroImageUrl: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        type: (initialValues as any).type ?? "WEDDINGS",
        title: (initialValues as any).title ?? "",
        intro: (initialValues as any).intro ?? "",
        heroImageUrl: (initialValues as any).heroImageUrl ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.type]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean(initialValues?.type);
      const url = isEdit
        ? `/api/departments/${initialValues?.type}`
        : "/api/departments";
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Departamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disableType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WEDDINGS">Bodas</SelectItem>
                    <SelectItem value="QUINCEANERA">Quinceañera</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input 
                    placeholder="Título del departamento" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="intro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introducción</FormLabel>
              <FormControl>
                <Textarea 
                  rows={4} 
                  placeholder="Breve descripción del departamento..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="heroImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Imagen Principal</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://ejemplo.com/imagen.jpg" 
                  {...field} 
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
            ) : initialValues?.type ? (
              "Guardar Cambios"
            ) : (
              "Crear Departamento"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
