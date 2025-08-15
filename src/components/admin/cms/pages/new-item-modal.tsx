"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageForm } from "@/components/admin/forms/page-form";
import { Loader2 } from "lucide-react";

interface NewItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewItemModal({ open, onOpenChange }: NewItemModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSuccess = async () => {
    setSubmitting(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["cms", "pages"] });
      toast({
        title: "Página creada",
        description: "La página se ha creado exitosamente.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la página. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Crear Nueva Página
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {submitting ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Creando página...
              </span>
            </div>
          ) : (
            <PageForm onSuccess={handleSuccess} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
