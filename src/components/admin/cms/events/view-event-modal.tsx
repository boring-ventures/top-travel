"use client";

import { useState, useEffect } from "react";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
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
  User,
  DollarSign,
  Image,
  Package,
  X,
  Tag,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ViewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventSlug: string | null;
}

export function ViewEventModal({
  open,
  onOpenChange,
  eventSlug,
}: ViewEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async (pdfUrl: string, eventTitle: string) => {
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${eventTitle}-documento.pdf`;
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

  // Fetch event data when modal opens
  useEffect(() => {
    if (open && eventSlug) {
      setLoading(true);
      fetch(`/api/events/${eventSlug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el evento");
          return res.json();
        })
        .then((data) => {
          setEvent(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar el evento",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, eventSlug, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Ver Evento
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando evento...</span>
            </div>
          </div>
        ) : event ? (
          <div className="space-y-6 px-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Slug: {event.slug}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Artista / Evento
                        </div>
                        <div className="text-sm">{event.artistOrEvent}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Ubicación
                        </div>
                        <div className="text-sm">
                          {event.destination
                            ? `${event.destination.city}, ${event.destination.country}`
                            : "No especificada"}
                        </div>
                        {event.venue && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Venue: {event.venue}
                          </div>
                        )}
                      </div>
                    </div>

                    {event.fromPrice && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Precio
                          </div>
                          <div className="text-sm font-medium">
                            {formatPriceWithCurrency(
                              event.fromPrice,
                              event.currency,
                              false
                            )}
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
                            {new Date(event.startDate).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div>
                            Fin:{" "}
                            {new Date(event.endDate).toLocaleDateString(
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

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Estado
                      </div>
                      <StatusBadge status={event.status} />
                    </div>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Etiquetas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag: any) => (
                        <Badge key={tag.id} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.heroImageUrl && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Imagen Principal
                    </div>
                    <div className="relative">
                      <img
                        src={event.heroImageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.nextElementSibling?.classList.add("hidden");
                        }}
                      />
                      <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                        <div className="text-center">
                          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <div>Cargando imagen...</div>
                        </div>
                      </div>
                      <div className="hidden w-full h-48 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                        <div className="text-center">
                          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <div>Error al cargar la imagen</div>
                          <div className="text-xs mt-1 break-all">
                            {event.heroImageUrl}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Document */}
                {event.pdfUrl && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
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
                            onClick={() => window.open(event.pdfUrl, "_blank")}
                            className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Ver PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownloadPdf(event.pdfUrl, event.title)
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

                {event.amenities && event.amenities.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Incluye
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.exclusions && event.exclusions.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      No Incluye
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.exclusions.map(
                        (exclusion: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {exclusion}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {event.detailsJson && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Detalles
                    </div>
                    <div className="text-sm bg-muted p-3 rounded-md">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(event.detailsJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {event.gallery &&
                  Array.isArray(event.gallery) &&
                  event.gallery.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Galería
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {event.gallery.map(
                          (imageUrl: string, index: number) => (
                            <div key={index} className="relative">
                              <img
                                src={imageUrl}
                                alt={`${event.title} - Imagen ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                              <div className="hidden w-full h-32 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                                <div className="text-center">
                                  <Image className="h-4 w-4 mx-auto mb-1 opacity-50" />
                                  <div>Error</div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {event.gallery && !Array.isArray(event.gallery) && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Galería (JSON)
                    </div>
                    <div className="text-sm bg-muted p-3 rounded-md">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(event.gallery, null, 2)}
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
              No se pudo cargar el evento
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
