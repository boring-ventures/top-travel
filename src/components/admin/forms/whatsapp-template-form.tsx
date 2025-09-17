"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, X } from "lucide-react";
import { WhatsAppTemplateBuilder } from "./whatsapp-template-builder";
import { WhatsAppTemplateHelp } from "./whatsapp-template-help";
import { PhoneNumbersInput } from "./phone-numbers-input";
import {
  WhatsAppTemplateCreateSchema,
  WhatsAppTemplateUpdateSchema,
  TemplateUsageTypeSchema,
} from "@/lib/validations/whatsapp-template";
import type {
  WhatsAppTemplateCreateInput,
  WhatsAppTemplateUpdateInput,
  TemplateUsageType,
} from "@/lib/validations/whatsapp-template";

interface WhatsAppTemplateFormProps {
  initialValues?: any;
  initialTemplate?: string;
  initialUsageType?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onBackToExamples?: () => void;
}

export function WhatsAppTemplateForm({
  initialValues,
  initialTemplate,
  initialUsageType,
  onSuccess,
  onCancel,
  onBackToExamples,
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
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<WhatsAppTemplateCreateInput | WhatsAppTemplateUpdateInput>({
    resolver: zodResolver(schema),
    mode: "onSubmit", // Only validate on submit, not on every change
    defaultValues: initialValues
      ? {
          ...initialValues,
          // Handle migration from phoneNumber to phoneNumbers
          phoneNumbers:
            initialValues.phoneNumbers ||
            (initialValues.phoneNumber ? [initialValues.phoneNumber] : []),
        }
      : {
          name: "",
          templateBody: initialTemplate || "",
          phoneNumbers: [], // Start with empty array
          usageType: initialUsageType || "GENERAL",
          isDefault: false,
        },
  });

  const isDefault = watch("isDefault");

  // Reset form when initialValues change (for editing)
  useEffect(() => {
    if (initialValues) {
      const formData = {
        ...initialValues,
        // Handle migration from phoneNumber to phoneNumbers
        phoneNumbers:
          initialValues.phoneNumbers ||
          (initialValues.phoneNumber ? [initialValues.phoneNumber] : []),
      };
      setValue("name", formData.name || "");
      setValue("templateBody", formData.templateBody || "");
      setValue("phoneNumbers", formData.phoneNumbers || []);
      setValue("usageType", formData.usageType || "GENERAL");
      setValue("isDefault", formData.isDefault || false);
    }
  }, [initialValues, setValue]);

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
            <p className="text-sm text-corporate-red">{errors.name.message}</p>
          )}
        </div>

        <PhoneNumbersInput
          value={watch("phoneNumbers") || []}
          onChange={(phoneNumbers) => setValue("phoneNumbers", phoneNumbers)}
          error={errors.phoneNumbers?.message}
        />
        {errors.phoneNumbers && (
          <p className="text-sm text-corporate-red">
            {errors.phoneNumbers.message}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="usageType">Tipo de Uso *</Label>
          <Select
            value={watch("usageType") || "GENERAL"}
            onValueChange={(value) =>
              setValue("usageType", value as TemplateUsageType)
            }
          >
            <SelectTrigger className={errors.usageType ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecciona el tipo de uso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OFFERS">Ofertas</SelectItem>
              <SelectItem value="PACKAGES">Paquetes</SelectItem>
              <SelectItem value="DESTINATIONS">Destinos</SelectItem>
              <SelectItem value="EVENTS">Eventos</SelectItem>
              <SelectItem value="FIXED_DEPARTURES">Salidas Fijas</SelectItem>
              <SelectItem value="WEDDINGS">Bodas</SelectItem>
              <SelectItem value="QUINCEANERA">Quinceañeras</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
            </SelectContent>
          </Select>
          {errors.usageType && (
            <p className="text-sm text-corporate-red">
              {errors.usageType.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Define para qué tipo de contenido se usará esta plantilla
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="templateBody">Cuerpo de la Plantilla *</Label>
            <WhatsAppTemplateHelp />
          </div>
          <WhatsAppTemplateBuilder
            value={watch("templateBody") || ""}
            onChange={(value) => setValue("templateBody", value)}
            error={errors.templateBody?.message}
            usageType={watch("usageType") || "GENERAL"}
          />
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

      <div className="flex justify-between pt-4">
        <div className="flex space-x-2">
          {onBackToExamples && !isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={onBackToExamples}
              disabled={isSubmitting}
            >
              ← Volver a ejemplos
            </Button>
          )}
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
        </div>
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
