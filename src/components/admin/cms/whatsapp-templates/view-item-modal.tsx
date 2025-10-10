"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Loader2, ExternalLink, MessageSquare } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getRandomPhoneNumber } from "@/lib/whatsapp-client-utils";
import { WhatsAppTemplateBuilder } from "@/components/admin/forms/whatsapp-template-builder";

interface ViewItemModalProps {
  templateId: string;
  onSuccess?: () => void;
}

export function ViewItemModal({ templateId, onSuccess }: ViewItemModalProps) {
  const [open, setOpen] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVars, setPreviewVars] = useState({
    itemTitle: "Rio Carnival 5D4N",
    url: "https://gabytoptravel.com/package/rio-carnival-5d4n",
    utmSource: "cms-preview",
    utmCampaign: "demo",
  });
  const phone = "+59170000000";

  useEffect(() => {
    if (open && templateId) {
      setLoading(true);
      setError(null);
      fetch(`/api/whatsapp-templates/${templateId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setTemplateData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch template:", error);
          setError(`Error al cargar la plantilla: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, templateId]);

  const previewUrl = templateData
    ? buildWhatsAppUrl(
        getRandomPhoneNumber(templateData) || phone,
        templateData.templateBody,
        previewVars
      )
    : "";

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTemplateData(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="sm"
        title="Ver plantilla"
        onClick={() => setOpen(true)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Ver Plantilla de WhatsApp
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando plantilla...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">{error}</div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          ) : templateData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    {templateData.name}
                    {templateData.isDefault && (
                      <Badge variant="secondary">Por defecto</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Tipo de Uso
                        </Label>
                        <div className="mt-2">
                          <Badge variant="outline">
                            {templateData.usageType === "OFFERS"
                              ? "Ofertas"
                              : templateData.usageType === "PACKAGES"
                                ? "Paquetes"
                                : templateData.usageType === "DESTINATIONS"
                                  ? "Destinos"
                                  : templateData.usageType === "EVENTS"
                                    ? "Eventos"
                                    : templateData.usageType ===
                                        "FIXED_DEPARTURES"
                                      ? "Salidas Fijas"
                                      : "General"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Número de Teléfono
                        </Label>
                        <div className="mt-2 p-2 bg-muted rounded-md text-sm font-mono">
                          {templateData.phoneNumber || "No definido"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Cuerpo de la plantilla
                      </Label>
                      <div className="mt-2">
                        <WhatsAppTemplateBuilder
                          value={templateData.templateBody}
                          onChange={() => {}} // Read-only in view mode
                          className="pointer-events-none opacity-75"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vista previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preview-itemTitle">
                          Título del item
                        </Label>
                        <Input
                          id="preview-itemTitle"
                          value={previewVars.itemTitle}
                          onChange={(e) =>
                            setPreviewVars((v) => ({
                              ...v,
                              itemTitle: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="preview-url">URL</Label>
                        <Input
                          id="preview-url"
                          value={previewVars.url}
                          onChange={(e) =>
                            setPreviewVars((v) => ({
                              ...v,
                              url: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preview-utmSource">UTM Source</Label>
                        <Input
                          id="preview-utmSource"
                          value={previewVars.utmSource}
                          onChange={(e) =>
                            setPreviewVars((v) => ({
                              ...v,
                              utmSource: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="preview-utmCampaign">
                          UTM Campaign
                        </Label>
                        <Input
                          id="preview-utmCampaign"
                          value={previewVars.utmCampaign}
                          onChange={(e) =>
                            setPreviewVars((v) => ({
                              ...v,
                              utmCampaign: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Mensaje generado
                      </Label>
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                        {templateData.templateBody
                          .replace(/\{itemTitle\}/g, previewVars.itemTitle)
                          .replace(/\{url\}/g, previewVars.url)
                          .replace(/\{utmSource\}/g, previewVars.utmSource)
                          .replace(/\{utmCampaign\}/g, previewVars.utmCampaign)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Enlace de WhatsApp
                      </Label>
                      <div className="mt-2">
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm break-all"
                        >
                          {previewUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">
                Error al cargar los datos de la plantilla.
              </div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
