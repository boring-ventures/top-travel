"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DepartmentCreateInput,
  DepartmentCreateSchema,
  DepartmentUpdateSchema,
  DepartmentUpdateInput,
} from "@/lib/validations/department";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadDepartmentImage } from "@/lib/supabase/storage";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

  // Safely extract contact info with proper fallbacks
  const getContactInfo = () => {
    const contact = initialValues?.contactInfoJson as any;
    return {
      emails: Array.isArray(contact?.emails) ? contact.emails : [],
      phones: Array.isArray(contact?.phones) ? contact.phones : [],
    };
  };

  const form = useForm<DepartmentCreateInput | DepartmentUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initialValues?.type || undefined,
      title: initialValues?.title || "",
      intro: initialValues?.intro || "",
      heroImageUrl: initialValues?.heroImageUrl || undefined,
      // Keep existing content for non-editable fields
      heroContentJson: initialValues?.heroContentJson || {},
      packagesJson: initialValues?.packagesJson || [],
      servicesJson: initialValues?.servicesJson || [],
      contactInfoJson: getContactInfo(),
      additionalContentJson: initialValues?.additionalContentJson || {},
    },
  });

  // Field arrays for contact info only
  const contactEmailsArray = useFieldArray({
    control: form.control,
    name: "contactInfoJson.emails" as any,
  });

  const contactPhonesArray = useFieldArray({
    control: form.control,
    name: "contactInfoJson.phones" as any,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let finalHeroImageUrl = values.heroImageUrl;

      // Upload image if a new file was selected
      if (selectedImageFile) {
        const departmentType = values.type || "temp";
        finalHeroImageUrl = await uploadDepartmentImage(
          selectedImageFile,
          departmentType
        );
      }

      const url = isEditing
        ? `/api/departments/${initialValues.type}`
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Image */}
        <Card>
          <CardHeader>
            <CardTitle>Imagen Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="heroImageUrl"
              render={({ field }) => (
                <FormItem>
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
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Emails */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Emails</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => contactEmailsArray.append("")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Email
                </Button>
              </div>
              {contactEmailsArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`contactInfoJson.emails.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => contactEmailsArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Phones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Teléfonos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    contactPhonesArray.append({ number: "", label: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Teléfono
                </Button>
              </div>
              {contactPhonesArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`contactInfoJson.phones.${index}.number`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="+591 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`contactInfoJson.phones.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Principal, WhatsApp..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => contactPhonesArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
