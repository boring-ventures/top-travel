"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Eye,
  Copy,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Link,
  Hash,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBlock {
  id: string;
  type: "text" | "variable" | "line-break";
  content: string;
  variableType?: "itemTitle" | "url" | "utmSource" | "utmCampaign";
}

interface WhatsAppTemplateBuilderProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  usageType?: string;
}

const VARIABLE_TYPES = [
  {
    key: "itemTitle",
    label: "Título del Item",
    icon: Tag,
    description: "Nombre del paquete, oferta o destino",
  },
  { key: "url", label: "URL", icon: Link, description: "Enlace al contenido" },
  {
    key: "utmSource",
    label: "UTM Source",
    icon: Hash,
    description: "Fuente de tráfico",
  },
  {
    key: "utmCampaign",
    label: "UTM Campaign",
    icon: Hash,
    description: "Campaña de marketing",
  },
];

const TEMPLATE_EXAMPLES_BY_TYPE = {
  OFFERS: [
    {
      name: "Consulta de Oferta Simple",
      description: "Consulta básica sobre una oferta",
      template:
        "¡Hola! 👋\n\nMe interesa esta oferta: {itemTitle}\n\n¿Podrían darme más información sobre precios y fechas disponibles?\n\n¡Gracias! 🙏",
    },
    {
      name: "Consulta de Oferta Detallada",
      description: "Consulta completa sobre una oferta",
      template:
        "¡Buenos días! 🎉\n\nVi esta oferta y me llama mucho la atención: {itemTitle}\n\n¿Podrían enviarme más detalles? Me interesa saber sobre:\n- Precios\n- Fechas disponibles\n- Qué incluye la oferta\n- Condiciones especiales\n\n¡Gracias por su atención! 😊",
    },
    {
      name: "Consulta de Descuento",
      description: "Para consultas sobre descuentos especiales",
      template:
        "¡Hola! 💰\n\nMe interesa esta oferta con descuento: {itemTitle}\n\n¿Podrían confirmarme:\n- El precio final con descuento\n- Hasta cuándo es válida la oferta\n- Qué incluye exactamente\n\n¡Espero su respuesta! 🙏",
    },
  ],
  PACKAGES: [
    {
      name: "Consulta de Paquete Básica",
      description: "Consulta simple sobre un paquete",
      template:
        "¡Hola! ✈️\n\nMe interesa este paquete: {itemTitle}\n\n¿Podrían darme información sobre precios y fechas?\n\n¡Gracias! 🌍",
    },
    {
      name: "Consulta de Paquete Completa",
      description: "Consulta detallada sobre un paquete",
      template:
        "¡Buenos días! ✈️\n\nVi este paquete y me llama mucho la atención: {itemTitle}\n\n¿Podrían enviarme más detalles? Me interesa saber sobre:\n- Precios\n- Fechas disponibles\n- Qué incluye el paquete\n- Requisitos de viaje\n- Actividades incluidas\n\n¡Gracias por su atención! 😊",
    },
    {
      name: "Consulta de Paquete Familiar",
      description: "Para consultas sobre paquetes familiares",
      template:
        "¡Hola! 👨‍👩‍👧‍👦\n\nEstoy buscando un paquete familiar y me interesa: {itemTitle}\n\n¿Podrían darme información sobre:\n- Precios para familia (2 adultos + 2 niños)\n- Actividades para niños\n- Fechas recomendadas\n- Qué incluye para toda la familia\n\n¡Gracias! 🎉",
    },
  ],
  DESTINATIONS: [
    {
      name: "Consulta de Destino General",
      description: "Consulta general sobre un destino",
      template:
        "¡Hola! 🌍\n\nMe interesa viajar a: {itemTitle}\n\n¿Podrían darme información sobre:\n- Mejores fechas para viajar\n- Paquetes disponibles\n- Precios aproximados\n\n¡Gracias! ✈️",
    },
    {
      name: "Consulta de Destino Detallada",
      description: "Consulta completa sobre un destino",
      template:
        "¡Buenos días! 🌍\n\nMe interesa mucho visitar: {itemTitle}\n\n¿Podrían ayudarme con información sobre:\n- Mejores fechas para viajar\n- Paquetes disponibles\n- Precios aproximados\n- Requisitos de entrada\n- Actividades recomendadas\n- Clima en diferentes épocas\n\n¡Gracias por su tiempo! 😊",
    },
    {
      name: "Consulta de Destino Romántico",
      description: "Para consultas sobre destinos románticos",
      template:
        "¡Hola! 💕\n\nEstoy planeando un viaje romántico y me interesa: {itemTitle}\n\n¿Podrían recomendarme:\n- Paquetes para parejas\n- Actividades románticas\n- Mejores fechas para viajar\n- Hoteles recomendados\n\n¡Gracias! 🌹",
    },
  ],
  EVENTS: [
    {
      name: "Consulta de Evento Simple",
      description: "Consulta básica sobre un evento",
      template:
        "¡Hola! 🎊\n\nMe interesa participar en: {itemTitle}\n\n¿Podrían darme información sobre fechas y precios?\n\n¡Gracias! 🙏",
    },
    {
      name: "Consulta de Evento Completa",
      description: "Consulta detallada sobre un evento",
      template:
        "¡Buenos días! 🎊\n\nMe interesa mucho participar en: {itemTitle}\n\n¿Podrían darme información sobre:\n- Fechas exactas\n- Precios\n- Qué incluye\n- Cómo reservar\n- Requisitos de participación\n\n¡Espero su respuesta! 🙏",
    },
    {
      name: "Consulta de Evento Grupal",
      description: "Para consultas sobre eventos grupales",
      template:
        "¡Hola! 👥\n\nSomos un grupo interesado en: {itemTitle}\n\n¿Podrían darme información sobre:\n- Precios para grupos\n- Fechas disponibles\n- Qué incluye para el grupo\n- Descuentos por cantidad\n\n¡Gracias! 🎉",
    },
  ],
  FIXED_DEPARTURES: [
    {
      name: "Consulta de Salida Fija",
      description: "Consulta sobre salidas fijas",
      template:
        "¡Hola! 🚌\n\nMe interesa esta salida fija: {itemTitle}\n\n¿Podrían darme información sobre:\n- Fechas exactas\n- Precios\n- Qué incluye\n- Disponibilidad\n\n¡Gracias! ✈️",
    },
    {
      name: "Consulta de Salida Grupal",
      description: "Para consultas sobre salidas grupales",
      template:
        "¡Buenos días! 👥\n\nMe interesa esta salida fija: {itemTitle}\n\n¿Podrían darme información sobre:\n- Fechas disponibles\n- Precios por persona\n- Qué incluye el viaje\n- Límite de participantes\n- Requisitos de reserva\n\n¡Gracias por su atención! 😊",
    },
    {
      name: "Consulta de Salida Especial",
      description: "Para consultas sobre salidas especiales",
      template:
        "¡Hola! ⭐\n\nMe interesa esta salida especial: {itemTitle}\n\n¿Podrían confirmarme:\n- Fechas exactas\n- Precios finales\n- Qué hace especial este viaje\n- Actividades únicas incluidas\n\n¡Espero su respuesta! 🙏",
    },
  ],
  GENERAL: [
    {
      name: "Consulta General",
      description: "Consulta general sobre servicios",
      template:
        "¡Hola! 👋\n\nMe interesa conocer más sobre sus servicios de viaje.\n\n¿Podrían enviarme información sobre sus paquetes y destinos disponibles?\n\n¡Gracias! ✈️",
    },
    {
      name: "Consulta de Asesoría",
      description: "Para solicitar asesoría personalizada",
      template:
        "¡Buenos días! 🤝\n\nMe gustaría recibir asesoría personalizada para planificar mi viaje.\n\n¿Podrían ayudarme a encontrar la mejor opción según mis necesidades?\n\n¡Gracias por su tiempo! 😊",
    },
    {
      name: "Consulta de Información",
      description: "Para solicitar información general",
      template:
        "¡Hola! 📋\n\nMe interesa recibir información sobre sus servicios.\n\n¿Podrían enviarme un catálogo o información detallada?\n\n¡Gracias! 🙏",
    },
  ],
};

export function WhatsAppTemplateBuilder({
  value,
  onChange,
  error,
  className,
  usageType = "GENERAL",
}: WhatsAppTemplateBuilderProps) {
  const [blocks, setBlocks] = useState<MessageBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);

  // Parse existing template into blocks
  const parseTemplateToBlocks = useCallback(
    (template: string): MessageBlock[] => {
      if (!template) return [];

      const blockList: MessageBlock[] = [];
      let currentText = "";
      let blockId = 0;

      // Split by variables and line breaks
      const parts = template.split(/(\{[^}]+\}|\n)/);

      for (const part of parts) {
        if (part === "\n") {
          if (currentText) {
            blockList.push({
              id: `text-${blockId++}`,
              type: "text",
              content: currentText,
            });
            currentText = "";
          }
          blockList.push({
            id: `break-${blockId++}`,
            type: "line-break",
            content: "",
          });
        } else if (part.startsWith("{") && part.endsWith("}")) {
          if (currentText) {
            blockList.push({
              id: `text-${blockId++}`,
              type: "text",
              content: currentText,
            });
            currentText = "";
          }
          const variableKey = part.slice(1, -1);
          blockList.push({
            id: `var-${blockId++}`,
            type: "variable",
            content: part,
            variableType: variableKey as any,
          });
        } else {
          currentText += part;
        }
      }

      if (currentText) {
        blockList.push({
          id: `text-${blockId++}`,
          type: "text",
          content: currentText,
        });
      }

      return blockList;
    },
    []
  );

  // Convert blocks back to template string
  const blocksToTemplate = useCallback((blockList: MessageBlock[]): string => {
    return blockList
      .map((block) => {
        if (block.type === "line-break") return "\n";
        return block.content;
      })
      .join("");
  }, []);

  // Initialize blocks from value
  useEffect(() => {
    if (value && blocks.length === 0) {
      setBlocks(parseTemplateToBlocks(value));
    }
  }, [value, blocks.length]);

  // Sync template when blocks change (but not when loading examples)
  useEffect(() => {
    if (blocks.length > 0 && !isLoadingExample) {
      const newTemplate = blocksToTemplate(blocks);
      if (newTemplate !== value) {
        onChange(newTemplate);
      }
    }
  }, [blocks, value, onChange, isLoadingExample]);

  const addTextBlock = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const newBlock: MessageBlock = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "",
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    // Template will be synced via useEffect
  };

  const addVariableBlock = (variableType: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    const newBlock: MessageBlock = {
      id: `var-${Date.now()}`,
      type: "variable",
      content: `{${variableType}}`,
      variableType: variableType as any,
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    // Template will be synced via useEffect
  };

  const addLineBreak = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const newBlock: MessageBlock = {
      id: `break-${Date.now()}`,
      type: "line-break",
      content: "",
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    // Template will be synced via useEffect
  };

  const updateBlock = (id: string, content: string) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    // Template will be synced via useEffect
  };

  const removeBlock = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    const newBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(newBlocks);
    // Template will be synced via useEffect
  };

  const loadExample = (template: string) => {
    setIsLoadingExample(true);
    const newBlocks = parseTemplateToBlocks(template);
    setBlocks(newBlocks);
    // Reset the flag after a short delay to allow the blocks to be set
    setTimeout(() => setIsLoadingExample(false), 100);
  };

  const previewMessage = value
    .replace(/\{itemTitle\}/g, "Rio Carnival 5D4N")
    .replace(/\{url\}/g, "https://gabytoptravel.com/package/rio-carnival-5d4n")
    .replace(/\{utmSource\}/g, "whatsapp")
    .replace(/\{utmCampaign\}/g, "carnival2024");

  const validateTemplate = () => {
    const issues: string[] = [];

    if (!value.trim()) {
      issues.push("El mensaje no puede estar vacío");
    }

    if (value.length > 1000) {
      issues.push("El mensaje es muy largo (máximo 1000 caracteres)");
    }

    const variableMatches = value.match(/\{[^}]+\}/g) || [];
    const validVariables = ["itemTitle", "url", "utmSource", "utmCampaign"];
    const invalidVariables = variableMatches.filter(
      (v) => !validVariables.includes(v.slice(1, -1))
    );

    if (invalidVariables.length > 0) {
      issues.push(`Variables inválidas: ${invalidVariables.join(", ")}`);
    }

    return issues;
  };

  const validationIssues = validateTemplate();

  // Get examples based on usage type
  const currentExamples =
    TEMPLATE_EXAMPLES_BY_TYPE[
      usageType as keyof typeof TEMPLATE_EXAMPLES_BY_TYPE
    ] || TEMPLATE_EXAMPLES_BY_TYPE.GENERAL;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Template Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Plantillas de Ejemplo -{" "}
            {usageType === "OFFERS"
              ? "Ofertas"
              : usageType === "PACKAGES"
                ? "Paquetes"
                : usageType === "DESTINATIONS"
                  ? "Destinos"
                  : usageType === "EVENTS"
                    ? "Eventos"
                    : usageType === "FIXED_DEPARTURES"
                      ? "Salidas Fijas"
                      : "General"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentExamples.map((example, index) => (
              <Button
                key={index}
                variant={
                  selectedExample === example.name ? "default" : "outline"
                }
                size="sm"
                className="h-auto p-3 text-left justify-start"
                onClick={() => {
                  loadExample(example.template);
                  setSelectedExample(example.name);
                }}
              >
                <div>
                  <div className="font-medium text-xs">{example.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {example.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variable Insertion Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Insertar Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {VARIABLE_TYPES.map((variable) => {
              const Icon = variable.icon;
              return (
                <Button
                  key={variable.key}
                  variant="outline"
                  size="sm"
                  className="h-auto p-2 flex flex-col items-center gap-1"
                  onClick={(e) => addVariableBlock(variable.key, e)}
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{variable.label}</span>
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Haz clic en cualquier variable para insertarla en tu mensaje
          </p>
        </CardContent>
      </Card>

      {/* Message Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Constructor de Mensaje
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-3 w-3 mr-1" />
                {showPreview ? "Ocultar" : "Vista"} Previa
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => addTextBlock(e)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Texto
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => addLineBreak(e)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Salto de Línea
              </Button>
            </div>

            {/* Message Blocks */}
            <div className="space-y-2 min-h-[100px] p-3 border rounded-md bg-muted/20">
              {blocks.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Tu mensaje aparecerá aquí</p>
                  <p className="text-xs">
                    Usa los botones de arriba para empezar
                  </p>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <div key={block.id} className="flex items-center gap-2">
                    {block.type === "text" ? (
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Escribe tu texto aquí..."
                        className="flex-1"
                      />
                    ) : block.type === "variable" ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {VARIABLE_TYPES.find(
                            (v) => v.key === block.variableType
                          )?.icon &&
                            (() => {
                              const Icon = VARIABLE_TYPES.find(
                                (v) => v.key === block.variableType
                              )!.icon;
                              return <Icon className="h-3 w-3" />;
                            })()}
                          {block.content}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {
                            VARIABLE_TYPES.find(
                              (v) => v.key === block.variableType
                            )?.description
                          }
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                          Salto de línea
                        </span>
                        <Separator className="flex-1" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => removeBlock(block.id, e)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Validation */}
            {validationIssues.length > 0 && (
              <div className="space-y-1">
                {validationIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-red-600"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {issue}
                  </div>
                ))}
              </div>
            )}

            {validationIssues.length === 0 && value.trim() && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Mensaje válido
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  WhatsApp
                </div>
                <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                  {previewMessage || "Tu mensaje aparecerá aquí..."}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Caracteres: {value.length}/1000
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
}
