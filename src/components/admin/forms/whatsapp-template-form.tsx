"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, X } from "lucide-react";
import {
  WhatsAppTemplateCreateSchema,
  WhatsAppTemplateUpdateSchema,
} from "@/lib/validations/whatsapp-template";
import type {
  WhatsAppTemplateCreateInput,
  WhatsAppTemplateUpdateInput,
} from "@/lib/validations/whatsapp-template";

interface WhatsAppTemplateFormProps {
  initialValues?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WhatsAppTemplateForm({
  initialValues,
  onSuccess,
  onCancel,
}: WhatsAppTemplateFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialValues;
  const schema = isEditing
    ? WhatsAppTemplateUpdateSchema
    : WhatsAppTemplateCreateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WhatsAppTemplateCreateInput | WhatsAppTemplateUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      name: "",
      templateBody: "",
      isDefault: false,
    },
  });

  const isDefault = watch("isDefault");

  const onSubmit = async (
    data: WhatsAppTemplateCreateInput | WhatsAppTemplateUpdateInput
  ) => {
    setIsSubmitting(true);
    try {
      const url = isEditing
        ? `/api/whatsapp-templates/${initialValues.id}`
        : "/api/whatsapp-templates";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar la plantilla");
      }

      const result = await response.json();

      toast({
        title: isEditing ? "Plantilla actualizada" : "Plantilla creada",
        description: isEditing
          ? "La plantilla de WhatsApp se ha actualizado correctamente."
          : "La plantilla de WhatsApp se ha creado correctamente.",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar la plantilla",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Plantilla *</Label>
          <Input
            id="name"
            placeholder="Ej: Promoción de Carnaval"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="templateBody">Cuerpo de la Plantilla *</Label>
          <Textarea
            id="templateBody"
            placeholder="Hola! Te comparto esta increíble oferta para {itemTitle}. Más detalles en: {url}?utm_source={utmSource}&utm_campaign={utmCampaign}"
            rows={6}
            {...register("templateBody")}
            className={errors.templateBody ? "border-red-500" : ""}
          />
          {errors.templateBody && (
            <p className="text-sm text-red-600">
              {errors.templateBody.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Variables disponibles: {"{itemTitle}"}, {"{url}"}, {"{utmSource}"},{" "}
            {"{utmCampaign}"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isDefault"
            checked={isDefault}
            onCheckedChange={(checked) => setValue("isDefault", checked)}
          />
          <Label htmlFor="isDefault">Plantilla por defecto</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Actualizar" : "Crear"} Plantilla
        </Button>
      </div>
    </form>
  );
}
