"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2, AlertCircle, Edit, Trash2 } from "lucide-react";

interface ViewItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageSlug: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewItemModal({
  open,
  onOpenChange,
  pageSlug,
  onEdit,
  onDelete,
}: ViewItemModalProps) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && pageSlug) {
      fetchPage();
    }
  }, [open, pageSlug]);

  const fetchPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pages/${pageSlug}`);
      if (!res.ok) {
        throw new Error("No se pudo cargar la página");
      }
      const result = await res.json();
      setPage(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPage(null);
    setError(null);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Ver Página
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Cargando página...
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
              <Button onClick={fetchPage} variant="outline">
                Intentar de nuevo
              </Button>
            </div>
          ) : page ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Slug
                  </label>
                  <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                    {page.slug}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Estado
                  </label>
                  <StatusBadge status={page.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Título
                </label>
                <p className="text-lg font-medium">{page.title}</p>
              </div>

              {page.sectionsJson && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Contenido
                  </label>
                  <div className="bg-muted p-4 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(page.sectionsJson, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Creado
                  </label>
                  <p className="text-sm">{formatDate(page.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Actualizado
                  </label>
                  <p className="text-sm">{formatDate(page.updatedAt)}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
