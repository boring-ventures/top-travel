"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, Calendar, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ViewTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: string | null;
  onEdit?: () => void;
}

export function ViewTagModal({
  open,
  onOpenChange,
  tagId,
  onEdit,
}: ViewTagModalProps) {
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState<any>(null);
  const { toast } = useToast();

  // Fetch tag data when modal opens
  useEffect(() => {
    if (open && tagId) {
      setLoading(true);
      fetch(`/api/tags/${tagId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar la etiqueta");
          return res.json();
        })
        .then((data) => {
          setTag(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar la etiqueta",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, tagId, toast, onOpenChange]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "REGION":
        return "Región";
      case "THEME":
        return "Tema";
      case "DEPARTMENT":
        return "Departamento";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REGION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "THEME":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DEPARTMENT":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Ver Etiqueta
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando etiqueta...</span>
            </div>
          </div>
        ) : tag ? (
          <div className="px-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tag.name}</CardTitle>
                  <Badge className={getTypeColor(tag.type)}>
                    {getTypeLabel(tag.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      Nombre
                    </div>
                    <div className="text-sm">{tag.name}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      Slug
                    </div>
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {tag.slug}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      Tipo
                    </div>
                    <div className="text-sm">{getTypeLabel(tag.type)}</div>
                  </div>

                  {tag.createdAt && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Creado
                      </div>
                      <div className="text-sm">
                        {new Date(tag.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {onEdit && (
              <div className="flex justify-end">
                <Button onClick={onEdit} variant="outline">
                  Editar Etiqueta
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No se pudo cargar la etiqueta
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
