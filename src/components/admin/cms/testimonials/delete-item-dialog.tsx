"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Loader2 } from "lucide-react";

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonialId: string | null;
  testimonialTitle?: string;
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  testimonialId,
  testimonialTitle,
}: DeleteItemDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!testimonialId) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el testimonio");
      }

      await queryClient.invalidateQueries({
        queryKey: ["cms", "testimonials"],
      });

      toast({
        title: "Testimonio eliminado",
        description: "El testimonio se ha eliminado exitosamente.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el testimonio. Inténtalo de nuevo.",
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

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      onConfirm={handleConfirm}
      title="¿Eliminar testimonio?"
      description={
        testimonialTitle
          ? `¿Estás seguro de que quieres eliminar el testimonio de "${testimonialTitle}"? Esta acción no se puede deshacer.`
          : "¿Estás seguro de que quieres eliminar este testimonio? Esta acción no se puede deshacer."
      }
    />
  );
}
