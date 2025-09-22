"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
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
  Calendar,
  MapPin,
  Users,
  Check,
  X,
  FileText,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface ViewFixedDepartureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedDepartureSlug: string | null;
}

export function ViewFixedDepartureModal({
  open,
  onOpenChange,
  fixedDepartureSlug,
}: ViewFixedDepartureModalProps) {
  const [loading, setLoading] = useState(false);
  const [fixedDeparture, setFixedDeparture] = useState<any>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async (pdfUrl: string, departureTitle: string) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${departureTitle}-documento.pdf`;
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

  // Fetch fixed departure data when modal opens
  useEffect(() => {
    if (open && fixedDepartureSlug) {
      setLoading(true);
      fetch(`/api/fixed-departures/${fixedDepartureSlug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar la salida fija");
          return res.json();
        })
        .then((data) => {
          setFixedDeparture(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar la salida fija",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, fixedDepartureSlug, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Ver Salida Fija
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando salida fija...</span>
            </div>
          </div>
        ) : fixedDeparture ? (
          <div className="space-y-6 px-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {fixedDeparture.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hero Image */}
                {fixedDeparture.heroImageUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={fixedDeparture.heroImageUrl}
                      alt={fixedDeparture.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* PDF Document */}
                {fixedDeparture.pdfUrl && (
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
                            window.open(fixedDeparture.pdfUrl, "_blank")
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
                              fixedDeparture.pdfUrl,
                              fixedDeparture.title
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Destino
                        </div>
                        <div className="text-sm">
                          {fixedDeparture.destination?.city},{" "}
                          {fixedDeparture.destination?.country}
                        </div>
                      </div>
                    </div>

                    {fixedDeparture.seatsInfo && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Información de Asientos
                          </div>
                          <div className="text-sm">
                            {fixedDeparture.seatsInfo}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Fechas
                        </div>
                        <div className="text-sm">
                          <div>
                            Inicio:{" "}
                            {new Date(
                              fixedDeparture.startDate
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div>
                            Fin:{" "}
                            {new Date(
                              fixedDeparture.endDate
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Estado
                      </div>
                      <StatusBadge status={fixedDeparture.status} />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {fixedDeparture.amenities &&
                  fixedDeparture.amenities.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        Incluye
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {fixedDeparture.amenities.map(
                          (amenity: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                              <span>{amenity}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Exclusions */}
                {fixedDeparture.exclusions &&
                  fixedDeparture.exclusions.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        No Incluye
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {fixedDeparture.exclusions.map(
                          (exclusion: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <X className="h-4 w-4 text-red-600" />
                              <span>{exclusion}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {fixedDeparture.detailsJson && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Detalles
                    </div>
                    <div className="text-sm bg-muted p-3 rounded-md">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(fixedDeparture.detailsJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
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
              No se pudo cargar la salida fija
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
