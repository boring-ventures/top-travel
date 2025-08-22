"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DepartmentForm } from "@/components/admin/forms/department-form";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentType: string | null;
}

export function EditItemModal({
  open,
  onOpenChange,
  departmentType,
}: EditItemModalProps) {
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const handleSuccess = async () => {
    setSubmitting(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["cms", "departments"] });
      toast({
        title: "Departamento actualizado",
        description: "Los cambios se han guardado exitosamente.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo actualizar el departamento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setDepartment(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Editar Departamento
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
            submitting ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Guardando cambios...
                </span>
              </div>
            ) : (
              <DepartmentForm
                initialValues={department}
                onSuccess={handleSuccess}
              />
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
