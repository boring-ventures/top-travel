"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Edit } from "lucide-react";
import { DestinationForm } from "@/components/admin/forms/destination-form";

interface EditDestinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationId: string | null;
}

export function EditDestinationModal({
  open,
  onOpenChange,
  destinationId,
}: EditDestinationModalProps) {
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch destination data when modal opens
  useEffect(() => {
    if (open && destinationId) {
      setLoading(true);
      fetch(`/api/destinations/${destinationId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el destino");
          return res.json();
        })
        .then((data) => {
          setDestination(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar el destino",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, destinationId, toast, onOpenChange]);

  const handleSuccess = () => {
    // Refresh the destinations list
    queryClient.invalidateQueries({ queryKey: ["cms", "destinations"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Destino
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando destino...</span>
            </div>
          </div>
        ) : destination ? (
          <div className="px-2">
            <DestinationForm
              initialValues={destination}
              onSuccess={handleSuccess}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No se pudo cargar el destino
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
