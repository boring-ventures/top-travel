"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DepartmentCreateInput,
  DepartmentCreateSchema,
  DepartmentUpdateSchema,
  DepartmentUpdateInput,
} from "@/lib/validations/department";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
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
import { uploadDepartmentImage } from "@/lib/supabase/storage";
import { Loader2 } from "lucide-react";

interface DepartmentFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<DepartmentUpdateInput & { id: string }>;
}

export function DepartmentForm({
  onSuccess,
  initialValues,
}: DepartmentFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const isEditing = !!initialValues;
  const schema = isEditing ? DepartmentUpdateSchema : DepartmentCreateSchema;

  const form = useForm<DepartmentCreateInput | DepartmentUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      type: undefined,
      title: "",
      intro: "",
      heroImageUrl: undefined,
    },
  });

  const disableType = isEditing;

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let finalHeroImageUrl = values.heroImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        console.log("Uploading selected image file...");
        const departmentType = values.type || "temp";
        finalHeroImageUrl = await uploadDepartmentImage(
          selectedImageFile,
          departmentType
        );
        console.log("Image uploaded successfully:", finalHeroImageUrl);
      }

      const url = isEditing
        ? `/api/departments/${initialValues.id}`
        : "/api/departments";
      const method = isEditing ? "PATCH" : "POST";

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
        body: JSON.stringify(apiData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await res.json();

      // Clear the selected file after successful submission
      setSelectedImageFile(null);

      onSuccess?.();
      if (!isEditing) form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
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
                {!initialValues?.type && (
                  <p className="text-xs text-muted-foreground">
                    Nota: Solo puede existir un departamento de cada tipo. Si ya
                    existe, use la función de editar.
                  </p>
                )}
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
                  <Input placeholder="Título del departamento" {...field} />
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
              <FormLabel>Imagen Principal</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onFileSelect={(file) => setSelectedImageFile(file)}
                  deferred={true}
                  placeholder="Imagen Principal del Departamento"
                  aspectRatio={3 / 2}
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
