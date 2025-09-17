"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Rocket,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  X,
  Lightbulb,
} from "lucide-react";

interface WhatsAppTemplateQuickstartProps {
  onSelectTemplate: (template: string) => void;
  onClose: () => void;
  className?: string;
  usageType?: string;
  onUsageTypeChange?: (usageType: string) => void;
}

const QUICKSTART_TEMPLATES_BY_TYPE = {
  OFFERS: [
    {
      id: "offer-simple",
      name: "Consulta de Oferta Simple",
      description: "Consulta básica sobre una oferta",
      template:
        "¡Hola! 👋\n\nMe interesa esta oferta: {itemTitle}\n\n¿Podrían darme más información sobre precios y fechas disponibles?\n\n¡Gracias! 🙏",
      category: "Ofertas",
    },
    {
      id: "offer-detailed",
      name: "Consulta de Oferta Detallada",
      description: "Consulta completa sobre una oferta",
      template:
        "¡Buenos días! 🎉\n\nVi esta oferta y me llama mucho la atención: {itemTitle}\n\n¿Podrían enviarme más detalles? Me interesa saber sobre:\n- Precios\n- Fechas disponibles\n- Qué incluye la oferta\n- Condiciones especiales\n\n¡Gracias por su atención! 😊",
      category: "Ofertas",
    },
  ],
  PACKAGES: [
    {
      id: "package-simple",
      name: "Consulta de Paquete Básica",
      description: "Consulta simple sobre un paquete",
      template:
        "¡Hola! ✈️\n\nMe interesa este paquete: {itemTitle}\n\n¿Podrían darme información sobre precios y fechas?\n\n¡Gracias! 🌍",
      category: "Paquetes",
    },
    {
      id: "package-detailed",
      name: "Consulta de Paquete Completa",
      description: "Consulta detallada sobre un paquete",
      template:
        "¡Buenos días! ✈️\n\nVi este paquete y me llama mucho la atención: {itemTitle}\n\n¿Podrían enviarme más detalles? Me interesa saber sobre:\n- Precios\n- Fechas disponibles\n- Qué incluye el paquete\n- Requisitos de viaje\n- Actividades incluidas\n\n¡Gracias por su atención! 😊",
      category: "Paquetes",
    },
  ],
  DESTINATIONS: [
    {
      id: "destination-simple",
      name: "Consulta de Destino General",
      description: "Consulta general sobre un destino",
      template:
        "¡Hola! 🌍\n\nMe interesa viajar a: {itemTitle}\n\n¿Podrían darme información sobre:\n- Mejores fechas para viajar\n- Paquetes disponibles\n- Precios aproximados\n\n¡Gracias! ✈️",
      category: "Destinos",
    },
    {
      id: "destination-detailed",
      name: "Consulta de Destino Detallada",
      description: "Consulta completa sobre un destino",
      template:
        "¡Buenos días! 🌍\n\nMe interesa mucho visitar: {itemTitle}\n\n¿Podrían ayudarme con información sobre:\n- Mejores fechas para viajar\n- Paquetes disponibles\n- Precios aproximados\n- Requisitos de entrada\n- Actividades recomendadas\n- Clima en diferentes épocas\n\n¡Gracias por su tiempo! 😊",
      category: "Destinos",
    },
  ],
  EVENTS: [
    {
      id: "event-simple",
      name: "Consulta de Evento Simple",
      description: "Consulta básica sobre un evento",
      template:
        "¡Hola! 🎊\n\nMe interesa participar en: {itemTitle}\n\n¿Podrían darme información sobre fechas y precios?\n\n¡Gracias! 🙏",
      category: "Eventos",
    },
    {
      id: "event-detailed",
      name: "Consulta de Evento Completa",
      description: "Consulta detallada sobre un evento",
      template:
        "¡Buenos días! 🎊\n\nMe interesa mucho participar en: {itemTitle}\n\n¿Podrían darme información sobre:\n- Fechas exactas\n- Precios\n- Qué incluye\n- Cómo reservar\n- Requisitos de participación\n\n¡Espero su respuesta! 🙏",
      category: "Eventos",
    },
  ],
  FIXED_DEPARTURES: [
    {
      id: "departure-simple",
      name: "Consulta de Salida Fija",
      description: "Consulta sobre salidas fijas",
      template:
        "¡Hola! 🚌\n\nMe interesa esta salida fija: {itemTitle}\n\n¿Podrían darme información sobre:\n- Fechas exactas\n- Precios\n- Qué incluye\n- Disponibilidad\n\n¡Gracias! ✈️",
      category: "Salidas Fijas",
    },
    {
      id: "departure-detailed",
      name: "Consulta de Salida Grupal",
      description: "Para consultas sobre salidas grupales",
      template:
        "¡Buenos días! 👥\n\nMe interesa esta salida fija: {itemTitle}\n\n¿Podrían darme información sobre:\n- Fechas disponibles\n- Precios por persona\n- Qué incluye el viaje\n- Límite de participantes\n- Requisitos de reserva\n\n¡Gracias por su atención! 😊",
      category: "Salidas Fijas",
    },
  ],
  WEDDINGS: [
    {
      id: "wedding-consultation",
      name: "Consulta de Boda",
      description: "Consulta sobre bodas de destino",
      template:
        "¡Hola! 💒\n\nMe interesa planificar mi boda de destino: {itemTitle}\n\n¿Podrían darme información sobre:\n- Paquetes disponibles\n- Precios\n- Fechas disponibles\n- Qué incluye\n- Proceso de reserva\n\n¡Gracias! 💕",
      category: "Bodas",
    },
    {
      id: "wedding-quote",
      name: "Cotización de Boda",
      description: "Solicitar cotización para boda",
      template:
        "¡Buenos días! 💒\n\nQuiero cotizar mi boda de destino: {itemTitle}\n\n¿Podrían enviarme una cotización detallada incluyendo:\n- Precios por persona\n- Servicios incluidos\n- Fechas disponibles\n- Opciones de personalización\n\n¡Espero su respuesta! 💕",
      category: "Bodas",
    },
  ],
  QUINCEANERA: [
    {
      id: "quinceanera-consultation",
      name: "Consulta de Quinceañera",
      description: "Consulta sobre quinceañeras de destino",
      template:
        "¡Hola! 👑\n\nMe interesa planificar mi quinceañera de destino: {itemTitle}\n\n¿Podrían darme información sobre:\n- Paquetes disponibles\n- Precios\n- Fechas disponibles\n- Qué incluye\n- Proceso de reserva\n\n¡Gracias! ✨",
      category: "Quinceañeras",
    },
    {
      id: "quinceanera-quote",
      name: "Cotización de Quinceañera",
      description: "Solicitar cotización para quinceañera",
      template:
        "¡Buenos días! 👑\n\nQuiero cotizar mi quinceañera de destino: {itemTitle}\n\n¿Podrían enviarme una cotización detallada incluyendo:\n- Precios por persona\n- Servicios incluidos\n- Fechas disponibles\n- Opciones de personalización\n\n¡Espero su respuesta! ✨",
      category: "Quinceañeras",
    },
  ],
  GENERAL: [
    {
      id: "general-inquiry",
      name: "Consulta General",
      description: "Para consultas generales de clientes",
      template:
        "¡Hola! 👋\n\nMe interesa conocer más sobre sus servicios de viaje.\n\n¿Podrían enviarme información sobre sus paquetes y destinos disponibles?\n\n¡Gracias! ✈️",
      category: "General",
    },
    {
      id: "consultation-inquiry",
      name: "Consulta de Asesoría",
      description: "Para solicitar asesoría personalizada",
      template:
        "¡Buenos días! 🤝\n\nMe gustaría recibir asesoría personalizada para planificar mi viaje.\n\n¿Podrían ayudarme a encontrar la mejor opción según mis necesidades?\n\n¡Gracias por su tiempo! 😊",
      category: "General",
    },
  ],
};

export function WhatsAppTemplateQuickstart({
  onSelectTemplate,
  onClose,
  className,
  usageType = "GENERAL",
  onUsageTypeChange,
}: WhatsAppTemplateQuickstartProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (template: string) => {
    onSelectTemplate(template);
    // Don't close the modal - let the user review and edit the template
  };

  // Get templates based on usage type
  const currentTemplates =
    QUICKSTART_TEMPLATES_BY_TYPE[
      usageType as keyof typeof QUICKSTART_TEMPLATES_BY_TYPE
    ] || QUICKSTART_TEMPLATES_BY_TYPE.GENERAL;
  const categories = Array.from(
    new Set(currentTemplates.map((t) => t.category))
  );

  return (
    <div className={className}>
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-600" />
              ¡Crea tu primera plantilla!
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Selecciona una plantilla predefinida para cargarla en el formulario
            y editarla, o crea una desde cero.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Type Selector */}
          {onUsageTypeChange && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Uso</label>
              <Select value={usageType} onValueChange={onUsageTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de uso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="OFFERS">Ofertas</SelectItem>
                  <SelectItem value="PACKAGES">Paquetes</SelectItem>
                  <SelectItem value="DESTINATIONS">Destinos</SelectItem>
                  <SelectItem value="EVENTS">Eventos</SelectItem>
                  <SelectItem value="FIXED_DEPARTURES">
                    Salidas Fijas
                  </SelectItem>
                  <SelectItem value="WEDDINGS">Bodas</SelectItem>
                  <SelectItem value="QUINCEANERA">Quinceañeras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-green-800 dark:text-green-200">
                  Consejo rápido
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Las plantillas con variables como {"{itemTitle}"} se
                  personalizan automáticamente. Puedes cargar una plantilla de
                  ejemplo y editarla según tus necesidades antes de guardarla.
                </p>
              </div>
            </div>
          </div>

          {/* Template Categories */}
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentTemplates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <Button
                      key={template.id}
                      variant={
                        selectedTemplate === template.id ? "default" : "outline"
                      }
                      size="sm"
                      className="h-auto p-3 text-left justify-start"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-xs">
                          {template.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          ))}

          {/* Selected Template Preview */}
          {selectedTemplate && (
            <div className="border rounded-lg p-3 bg-muted/20">
              <h4 className="font-medium text-sm mb-2">
                Vista previa del mensaje:
              </h4>
              <div className="text-sm bg-white dark:bg-gray-900 p-3 rounded border font-mono whitespace-pre-wrap">
                {currentTemplates
                  .find((t) => t.id === selectedTemplate)
                  ?.template.replace(/\{itemTitle\}/g, "Rio Carnival 5D4N")
                  .replace(
                    /\{url\}/g,
                    "https://gabytoptravel.com/package/rio-carnival-5d4n"
                  )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Crear desde cero
            </Button>
            <div className="flex items-center gap-2">
              {selectedTemplate && (
                <Button
                  size="sm"
                  onClick={() => {
                    const template = currentTemplates.find(
                      (t) => t.id === selectedTemplate
                    );
                    if (template) {
                      handleSelectTemplate(template.template);
                    }
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Cargar en el formulario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
