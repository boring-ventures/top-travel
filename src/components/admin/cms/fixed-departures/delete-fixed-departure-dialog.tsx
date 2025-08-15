"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteFixedDepartureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedDepartureSlug: string | null;
  fixedDepartureTitle?: string;
}

export function DeleteFixedDepartureDialog({
  open,
  onOpenChange,
  fixedDepartureSlug,
  fixedDepartureTitle,
}: DeleteFixedDepartureDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!fixedDepartureSlug) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/fixed-departures/${fixedDepartureSlug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar la salida fija");
      }

      toast({
        title: "Salida fija eliminada",
        description: "La salida fija se ha eliminado exitosamente.",
      });

      // Refresh the fixed departures list
      queryClient.invalidateQueries({ queryKey: ["cms", "fixed-departures"] });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la salida fija",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Eliminar Salida Fija
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar la salida fija{" "}
            <span className="font-medium">
              {fixedDepartureTitle || fixedDepartureSlug}
            </span>
            ? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
