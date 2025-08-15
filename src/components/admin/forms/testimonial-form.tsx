"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TestimonialCreateInput,
  TestimonialCreateSchema,
  TestimonialUpdateInput,
  TestimonialUpdateSchema,
} from "@/lib/validations/testimonial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TestimonialFormProps {
  onSuccess?: () => void;
  initialValues?: any;
}

export function TestimonialForm({ onSuccess, initialValues }: TestimonialFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const isEditing = !!initialValues;
  const schema = isEditing ? TestimonialUpdateSchema : TestimonialCreateSchema;
  
  const form = useForm<TestimonialCreateInput | TestimonialUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      authorName: "",
      location: "",
      rating: 5,
      content: "",
      status: "PENDING",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const url = isEditing ? `/api/testimonials/${initialValues.id}` : "/api/testimonials";
      const method = isEditing ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al guardar");
      }
      
      toast({
        title: isEditing ? "Testimonio actualizado" : "Testimonio creado",
        description: isEditing 
          ? "Los cambios se han guardado exitosamente."
          : "El testimonio se ha creado exitosamente.",
      });
      
      onSuccess?.();
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "APPROVED":
        return "Aprobado";
      case "PUBLISHED":
        return "Publicado";
      default:
        return status;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autor *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del autor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad, País" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calificación *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="5"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Escribe el testimonio aquí..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting 
              ? (isEditing ? "Guardando..." : "Creando...") 
              : (isEditing ? "Guardar Cambios" : "Crear Testimonio")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}

