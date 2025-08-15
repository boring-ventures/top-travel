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
import { Loader2, Eye, Calendar, MapPin, Users } from "lucide-react";

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
