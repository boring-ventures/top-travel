"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Eye,
  MapPin,
  Star,
  Calendar,
  ExternalLink,
  FileText,
} from "lucide-react";

interface ViewDestinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationId: string | null;
}

export function ViewDestinationModal({
  open,
  onOpenChange,
  destinationId,
}: ViewDestinationModalProps) {
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<any>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async (
    pdfUrl: string,
    destinationTitle: string
  ) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${destinationTitle}-documento.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Fallback: open in new tab
      window.open(pdfUrl, "_blank");
    }
  };

  // Fetch destination data when modal opens
  useEffect(() => {
    if (open && destinationId) {
      setLoading(true);
      fetch(`/api/destinations/${destinationId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el destino");
          return res.json();
        })
        .then((data) => {
          setDestination(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar el destino",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, destinationId, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Ver Destino
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando destino...</span>
            </div>
          </div>
        ) : destination ? (
          <div className="space-y-6 px-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  {destination.city}, {destination.country}
                  {destination.isFeatured && (
                    <Badge
                      variant="default"
                      className="ml-2 flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                      Destacado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Slug
                      </div>
                      <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {destination.slug || "—"}
                      </div>
                    </div>

                    {destination.description && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Descripción
                        </div>
                        <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded">
                          {destination.description}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          Creado
                        </div>
                        <div className="font-medium">
                          {new Date(destination.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          Actualizado
                        </div>
                        <div className="font-medium">
                          {new Date(destination.updatedAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {destination.heroImageUrl && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Imagen Principal
                        </div>
                        <a
                          href={destination.heroImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <div className="relative">
                            <img
                              src={destination.heroImageUrl}
                              alt={`${destination.city}, ${destination.country}`}
                              className="h-48 w-full rounded-lg object-cover ring-1 ring-border group-hover:ring-2 transition-all"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                              <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </a>
                      </div>
                    )}

                    {/* PDF Document */}
                    {destination.pdfUrl && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Documento PDF
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                Documento PDF disponible
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Haz clic en los botones para ver o descargar el
                                documento
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(destination.pdfUrl, "_blank")
                                }
                                className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Ver PDF
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadPdf(
                                    destination.pdfUrl,
                                    `${destination.city}, ${destination.country}`
                                  )
                                }
                                className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
                              >
                                <FileText className="h-3 w-3" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Estado
                      </div>
                      <div className="flex items-center gap-2">
                        {destination.isFeatured ? (
                          <Badge
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            Destacado
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Regular</Badge>
                        )}
                      </div>
                    </div>

                    {destination.tagIds && destination.tagIds.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Etiquetas
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {destination.tagIds.map((tagId: string) => (
                            <Badge
                              key={tagId}
                              variant="outline"
                              className="text-xs"
                            >
                              {tagId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No se pudo cargar el destino
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
