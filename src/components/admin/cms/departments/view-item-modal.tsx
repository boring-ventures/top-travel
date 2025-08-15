"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface ViewItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentType: string | null;
}

export function ViewItemModal({ 
  open, 
  onOpenChange, 
  departmentType 
}: ViewItemModalProps) {
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && departmentType) {
      fetchDepartment();
    }
  }, [open, departmentType]);

  const fetchDepartment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/departments/${departmentType}`);
      if (!res.ok) {
        throw new Error("No se pudo cargar el departamento");
      }
      const data = await res.json();
      setDepartment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDepartment(null);
    setError(null);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'WEDDINGS':
        return 'Bodas';
      case 'QUINCEANERA':
        return 'Quinceañera';
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Ver Departamento
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Cargando departamento...
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
              <Button onClick={fetchDepartment} variant="outline">
                Intentar de nuevo
              </Button>
            </div>
          ) : department ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{department.title}</h3>
                <Badge variant="secondary">
                  {getTypeLabel(department.type)}
                </Badge>
              </div>
              
              <Separator />
              
              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-muted-foreground">
                      Introducción
                    </h4>
                    <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                      {department.intro || "Sin introducción"}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Creado</p>
                      <p className="font-medium">
                        {formatDate(department.createdAt)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Actualizado</p>
                      <p className="font-medium">
                        {formatDate(department.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-muted-foreground">
                      Imagen Principal
                    </h4>
                    {department.heroImageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={department.heroImageUrl}
                          alt="Imagen principal"
                          className="w-full h-48 rounded-lg object-cover ring-1 ring-border"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(department.heroImageUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver imagen
                        </Button>
                      </div>
                    ) : (
                      <div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Sin imagen
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
