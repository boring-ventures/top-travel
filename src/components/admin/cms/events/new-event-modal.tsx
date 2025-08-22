"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EventForm } from "@/components/admin/forms/event-form";

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewEventModal({ open, onOpenChange }: NewEventModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    toast({
      title: "Evento creado",
      description: "El evento se ha creado exitosamente.",
    });

    // Refresh the events list
    queryClient.invalidateQueries({ queryKey: ["cms", "events"] });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nuevo Evento
          </DialogTitle>
        </DialogHeader>

        <EventForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
