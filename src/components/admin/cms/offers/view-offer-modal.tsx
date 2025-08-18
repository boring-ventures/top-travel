"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Loader2 } from "lucide-react";

interface ViewOfferModalProps {
  offerId: string;
}

export function ViewOfferModal({ offerId }: ViewOfferModalProps) {
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && offerId) {
      setLoading(true);
      fetch(`/api/offers/${offerId}`)
        .then((res) => res.json())
        .then((data) => {
          setOffer(data);
        })
        .catch((error) => {
          console.error("Failed to fetch offer:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, offerId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Ver detalles">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Ver Oferta
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando oferta...
                </span>
              </div>
            </div>
          ) : offer ? (
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {offer.title}
                    </h3>
                    {offer.subtitle && (
                      <p className="text-lg text-gray-600">{offer.subtitle}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Estado
                      </label>
                      <div className="mt-1">
                        <StatusBadge status={offer.status} />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Destacada
                      </label>
                      <div className="mt-1">
                        {offer.isFeatured ? (
                          <Badge variant="secondary">Destacada</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </div>
                    </div>

                    {offer.displayTag && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Etiqueta de Visualización
                        </label>
                        <div className="mt-1">
                          <Badge variant="outline">{offer.displayTag}</Badge>
                        </div>
                      </div>
                    )}

                    {offer.package && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Paquete Vinculado
                        </label>
                        <div className="mt-1">
                          <Badge variant="default">{offer.package.title}</Badge>
                        </div>
                      </div>
                    )}

                    {offer.externalUrl && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          URL Externa
                        </label>
                        <div className="mt-1">
                          <a 
                            href={offer.externalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all"
                          >
                            {offer.externalUrl}
                          </a>
                        </div>
                      </div>
                    )}

                    {(offer.startAt || offer.endAt) && (
                      <div className="col-span-full">
                        <label className="text-sm font-medium text-muted-foreground">
                          Período de la Oferta
                        </label>
                        <div className="mt-1">
                          {offer.startAt && offer.endAt ? (
                            <span>
                              {new Date(offer.startAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(offer.endAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          ) : offer.startAt ? (
                            <span>
                              Desde{" "}
                              {new Date(offer.startAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          ) : offer.endAt ? (
                            <span>
                              Hasta{" "}
                              {new Date(offer.endAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>

                  {offer.bannerImageUrl && (
                    <div className="col-span-full">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Imagen de Banner
                      </label>
                      <div className="mt-1">
                        <img
                          src={offer.bannerImageUrl}
                          alt="Banner"
                          className="w-full max-w-2xl h-48 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-span-full pt-6 border-t">
                    <div className="flex justify-end">
                      <Button onClick={() => setOpen(false)} size="lg">
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-sm text-red-600">
              Error al cargar los datos de la oferta.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
