"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DestinationCreateInput,
  DestinationCreateSchema,
  DestinationUpdateInput,
} from "@/lib/validations/destination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type DestinationFormProps = {
  onSuccess?: () => void;
  initialValues?: Partial<DestinationUpdateInput & { id: string }>;
};

export function DestinationForm({
  onSuccess,
  initialValues,
}: DestinationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DestinationCreateInput>({
    resolver: zodResolver(DestinationCreateSchema),
    defaultValues: {
      slug: "",
      country: "",
      city: "",
      description: "",
      heroImageUrl: "",
      isFeatured: false,
      tagIds: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        slug: (initialValues as any).slug ?? "",
        country: (initialValues as any).country ?? "",
        city: (initialValues as any).city ?? "",
        description: (initialValues as any).description ?? "",
        heroImageUrl: (initialValues as any).heroImageUrl ?? "",
        isFeatured: Boolean((initialValues as any).isFeatured) ?? false,
        tagIds: (initialValues as any).tagIds ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/destinations/${(initialValues as any).id}`
        : "/api/destinations";
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
        throw new Error(error.error || "Error al guardar el destino");
      }

      toast({
        title: isEdit ? "Destino actualizado" : "Destino creado",
        description: isEdit
          ? "El destino se ha actualizado exitosamente."
          : "El destino se ha creado exitosamente.",
      });

      onSuccess?.();
      if (!isEdit) form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el destino",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="ciudad-pais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del país" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Descripción breve del destino"
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
                  type="url"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isFeatured"
            {...form.register("isFeatured")}
            className="rounded border-gray-300"
          />
          <Label htmlFor="isFeatured" className="text-sm font-normal">
            Destino destacado
          </Label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialValues?.id ? "Actualizando..." : "Creando..."}
              </>
            ) : initialValues?.id ? (
              "Actualizar Destino"
            ) : (
              "Crear Destino"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
