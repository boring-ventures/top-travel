"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2, AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ViewItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonialId: string | null;
}

export function ViewItemModal({
  open,
  onOpenChange,
  testimonialId,
}: ViewItemModalProps) {
  const [testimonial, setTestimonial] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && testimonialId) {
      fetchTestimonial();
    }
  }, [open, testimonialId]);

  const fetchTestimonial = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`);
      if (!res.ok) {
        throw new Error("No se pudo cargar el testimonio");
      }
      const data = await res.json();
      setTestimonial(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTestimonial(null);
    setError(null);
    onOpenChange(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Ver Testimonio
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Cargando testimonio...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-destructive">
                  Error al cargar
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button onClick={fetchTestimonial} variant="outline">
                Intentar de nuevo
              </Button>
            </div>
          ) : testimonial ? (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Autor
                      </h3>
                      <p className="text-base font-medium">{testimonial.authorName}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Estado
                      </h3>
                      <StatusBadge status={testimonial.status} />
                    </div>

                    {testimonial.location && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Ubicación
                        </h3>
                        <p className="text-base">{testimonial.location}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Calificación
                      </h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>

                  {testimonial.content && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Contenido
                      </h3>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-base whitespace-pre-wrap leading-relaxed">
                          {testimonial.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {testimonial.createdAt && (
                    <div className="mt-6 pt-4 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Fecha de creación
                      </h3>
                      <p className="text-sm">
                        {new Date(testimonial.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
