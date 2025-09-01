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
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

  // Safely extract nested JSON fields with proper fallbacks
  const getHeroContent = () => {
    const content = initialValues?.heroContentJson as any;
    return {
      title: content?.title || "",
      subtitle: content?.subtitle || "",
      description: content?.description || "",
      primaryCTA: {
        text: content?.primaryCTA?.text || "",
        whatsappTemplate: content?.primaryCTA?.whatsappTemplate || "",
      },
      secondaryCTA: {
        text: content?.secondaryCTA?.text || "",
        href: content?.secondaryCTA?.href || "",
      },
    };
  };

  const getContactInfo = () => {
    const contact = initialValues?.contactInfoJson as any;
    return {
      emails: Array.isArray(contact?.emails) ? contact.emails : [],
      phones: Array.isArray(contact?.phones) ? contact.phones : [],
      locations: Array.isArray(contact?.locations) ? contact.locations : [],
    };
  };

  const getAdditionalContent = () => {
    const additional = initialValues?.additionalContentJson as any;
    return {
      sampleItinerary: {
        title: additional?.sampleItinerary?.title || "",
        description: additional?.sampleItinerary?.description || "",
        days: Array.isArray(additional?.sampleItinerary?.days)
          ? additional.sampleItinerary.days
          : [],
      },
    };
  };

  const form = useForm<DepartmentCreateInput | DepartmentUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initialValues?.type || undefined,
      title: initialValues?.title || "",
      intro: initialValues?.intro || "",
      heroImageUrl: initialValues?.heroImageUrl || undefined,
      heroContentJson: getHeroContent(),
      packagesJson: Array.isArray(initialValues?.packagesJson)
        ? initialValues.packagesJson
        : [],
      servicesJson: Array.isArray(initialValues?.servicesJson)
        ? initialValues.servicesJson
        : [],
      contactInfoJson: getContactInfo(),
      additionalContentJson: getAdditionalContent(),
    },
  });

  // Field arrays for dynamic content
  const packagesArray = useFieldArray({
    control: form.control,
    name: "packagesJson" as any,
  });

  const servicesArray = useFieldArray({
    control: form.control,
    name: "servicesJson" as any,
  });

  const contactEmailsArray = useFieldArray({
    control: form.control,
    name: "contactInfoJson.emails" as any,
  });

  const contactPhonesArray = useFieldArray({
    control: form.control,
    name: "contactInfoJson.phones" as any,
  });

  const itineraryDaysArray = useFieldArray({
    control: form.control,
    name: "additionalContentJson.sampleItinerary.days" as any,
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
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                        Nota: Solo puede existir un departamento de cada tipo.
                        Si ya existe, use la función de editar.
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
          </CardContent>
        </Card>

        {/* Hero Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="heroContentJson.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="Título principal del hero" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroContentJson.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Subtítulo del hero" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroContentJson.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Descripción del hero..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heroContentJson.primaryCTA.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto del CTA Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Comenzar Planificación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroContentJson.primaryCTA.whatsappTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template de WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Hola! Me gustaría..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heroContentJson.secondaryCTA.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto del CTA Secundario</FormLabel>
                    <FormControl>
                      <Input placeholder="Explorar Destinos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroContentJson.secondaryCTA.href"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace del CTA Secundario</FormLabel>
                    <FormControl>
                      <Input placeholder="/destinations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Packages Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Paquetes
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  packagesArray.append({
                    name: "",
                    price: "",
                    features: [],
                    color: "from-blue-500 to-blue-600",
                    order: packagesArray.fields.length,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Paquete
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {packagesArray.fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Paquete {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => packagesArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`packagesJson.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Básico, Premium..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`packagesJson.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <Input placeholder="$5,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`packagesJson.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color (Tailwind)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="from-blue-500 to-blue-600"
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
                  name={`packagesJson.${index}.features`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Características (una por línea)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Selección de lugar&#10;Catering básico&#10;Fotografía"
                          value={field.value?.join("\n") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.split("\n").filter((f) => f.trim())
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Servicios
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  servicesArray.append({
                    title: "",
                    description: "",
                    icon: "",
                    order: servicesArray.fields.length,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Servicio
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {servicesArray.fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Servicio {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => servicesArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`servicesJson.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Planificación experta"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`servicesJson.${index}.icon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icono (Lucide)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Users, Heart, Shield..."
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
                  name={`servicesJson.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Descripción del servicio..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
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

        {/* Sample Itinerary (for Quinceañera) */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Itinerario de Muestra (Quinceañera)
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="additionalContentJson.sampleItinerary.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Itinerario</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Itinerario sugerido: Quinceañera en París"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalContentJson.sampleItinerary.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del Itinerario</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Un ejemplo de cómo puede ser..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Días del Itinerario</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        itineraryDaysArray.append({
                          title: "",
                          description: "",
                          icon: "",
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Día
                    </Button>
                  </div>
                  {itineraryDaysArray.fields.map((field, index) => (
                    <Card key={field.id} className="p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Día {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => itineraryDaysArray.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`additionalContentJson.sampleItinerary.days.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Día 1: Llegada a París..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`additionalContentJson.sampleItinerary.days.${index}.icon`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icono (Lucide)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Plane, Castle, Archive..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`additionalContentJson.sampleItinerary.days.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Bienvenida a la Ciudad..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

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
