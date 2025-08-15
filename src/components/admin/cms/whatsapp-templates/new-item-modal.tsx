"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WhatsAppTemplateForm } from "@/components/admin/forms/whatsapp-template-form";
import { Plus } from "lucide-react";

interface NewItemModalProps {
  onSuccess?: () => void;
}

export function NewItemModal({ onSuccess }: NewItemModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Plantilla
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Crear Nueva Plantilla de WhatsApp
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          <WhatsAppTemplateForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
