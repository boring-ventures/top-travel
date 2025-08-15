"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { DestinationForm } from "@/components/admin/forms/destination-form";

interface NewDestinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewDestinationModal({
  open,
  onOpenChange,
}: NewDestinationModalProps) {
  const queryClient = useQueryClient();

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
            <Plus className="h-5 w-5" />
            Nuevo Destino
          </DialogTitle>
        </DialogHeader>

        <div className="px-2">
          <DestinationForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
