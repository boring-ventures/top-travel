"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  MessageSquare,
  Link,
  Hash,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Smartphone,
} from "lucide-react";

interface WhatsAppTemplateHelpProps {
  className?: string;
}

export function WhatsAppTemplateHelp({ className }: WhatsAppTemplateHelpProps) {
  const [showHelp, setShowHelp] = useState(false);

  const variableExamples = [
    {
      variable: "{itemTitle}",
      description:
        "Se reemplaza con el título del paquete, oferta o destino que el cliente está consultando",
      example: "Rio Carnival 5D4N",
      icon: Tag,
    },
    {
      variable: "{url}",
      description:
        "Se reemplaza con el enlace al contenido (opcional, para referencia)",
      example: "https://gabytoptravel.com/package/rio-carnival-5d4n",
      icon: Link,
    },
    {
      variable: "{utmSource}",
      description:
        "Se reemplaza con la fuente de tráfico (ej: whatsapp, facebook)",
      example: "whatsapp",
      icon: Hash,
    },
    {
      variable: "{utmCampaign}",
      description: "Se reemplaza con el nombre de la campaña",
      example: "carnival2024",
      icon: Hash,
    },
  ];

  const bestPractices = [
    {
      title: "Mantén el mensaje conciso",
      description:
        "Los clientes prefieren mensajes claros y directos para sus consultas",
      icon: MessageSquare,
    },
    {
      title: "Usa emojis con moderación",
      description:
        "Los emojis hacen el mensaje más amigable, pero no abuses de ellos",
      icon: "😊",
    },
    {
      title: "Incluye preguntas específicas",
      description: "Ayuda a los clientes a saber qué información solicitar",
      icon: CheckCircle2,
    },
    {
      title: "Personaliza el mensaje",
      description:
        "Usa variables como {itemTitle} para hacer la consulta más específica",
      icon: Lightbulb,
    },
  ];

  const commonMistakes = [
    {
      mistake: "No incluir variables",
      problem: "El mensaje será genérico y no específico para el contenido",
      solution: "Usa al menos {itemTitle} para personalizar la consulta",
    },
    {
      mistake: "Mensajes muy largos",
      problem: "Los clientes pueden no leer mensajes extensos",
      solution: "Mantén el mensaje claro y conciso, máximo 200 caracteres",
    },
    {
      mistake: "Variables mal escritas",
      problem: "Las variables no se reemplazarán correctamente",
      solution:
        "Usa exactamente: {itemTitle}, {url}, {utmSource}, {utmCampaign}",
    },
    {
      mistake: "No probar la plantilla",
      problem: "Puede haber errores que no se detectan hasta usarla",
      solution: "Usa la vista previa para verificar que todo se vea bien",
    },
  ];

  if (!showHelp) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowHelp(true)}
        className={className}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        ¿Cómo funcionan las plantillas?
      </Button>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Guía de Plantillas de WhatsApp
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(false)}
            >
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What are WhatsApp Templates */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              ¿Qué son las plantillas de WhatsApp?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Las plantillas son mensajes predefinidos que los clientes pueden
              usar para contactarte cuando están interesados en tus servicios.
              Se personalizan automáticamente según el contenido que estén
              consultando (paquetes, ofertas, etc.).
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Ejemplo:</strong> Cuando un cliente ve un paquete de
                viaje y hace clic en "Contactar por WhatsApp", se abre WhatsApp
                con un mensaje personalizado preguntando sobre ese paquete
                específico.
              </p>
            </div>
          </div>

          {/* Variables */}
          <div>
            <h3 className="font-semibold mb-3">Variables Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {variableExamples.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4" />
                      <Badge variant="secondary" className="font-mono">
                        {item.variable}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.description}
                    </p>
                    <p className="text-xs font-mono bg-muted p-2 rounded">
                      Ejemplo: {item.example}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Practices */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mejores Prácticas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bestPractices.map((practice, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {typeof practice.icon === "string" ? (
                      <span className="text-lg">{practice.icon}</span>
                    ) : (
                      <practice.icon className="h-4 w-4" />
                    )}
                    <h4 className="font-medium text-sm">{practice.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {practice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Errores Comunes
            </h3>
            <div className="space-y-3">
              {commonMistakes.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-red-600 mb-1">
                        ❌ {item.mistake}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.problem}
                      </p>
                      <p className="text-sm text-green-600">
                        ✅ <strong>Solución:</strong> {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Example Flow */}
          <div>
            <h3 className="font-semibold mb-3">Ejemplo de Flujo</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span>Cliente visita un paquete: "Rio Carnival 5D4N"</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>Cliente hace clic en "Contactar por WhatsApp"</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>Sistema reemplaza las variables en la plantilla</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span>
                    Se abre WhatsApp con mensaje de consulta personalizado
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(false)}
              className="w-full"
            >
              Entendido, cerrar guía
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
