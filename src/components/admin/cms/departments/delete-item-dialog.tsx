"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Loader2 } from "lucide-react";

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentType: string | null;
  departmentTitle?: string;
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  departmentType,
  departmentTitle,
}: DeleteItemDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!departmentType) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/departments/${departmentType}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el departamento");
      }

      await queryClient.invalidateQueries({ queryKey: ["cms", "departments"] });

      toast({
        title: "Departamento eliminado",
        description: "El departamento se ha eliminado exitosamente.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el departamento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      onOpenChange(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "WEDDINGS":
        return "Bodas";
      case "QUINCEANERA":
        return "Quinceañera";
      default:
        return type;
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      onConfirm={handleConfirm}
      title="¿Eliminar departamento?"
      description={
        departmentType && departmentTitle
          ? `¿Estás seguro de que quieres eliminar el departamento "${departmentTitle}" (${getTypeLabel(departmentType)})? Esta acción no se puede deshacer.`
          : "¿Estás seguro de que quieres eliminar este departamento? Esta acción no se puede deshacer."
      }
    />
  );
}
