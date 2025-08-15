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
import { TagForm } from "@/components/admin/forms/tag-form";

interface NewTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTagModal({ open, onOpenChange }: NewTagModalProps) {
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    // Refresh the tags list
    queryClient.invalidateQueries({ queryKey: ["cms", "tags"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nueva Etiqueta
          </DialogTitle>
        </DialogHeader>

        <div className="px-2">
          <TagForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
