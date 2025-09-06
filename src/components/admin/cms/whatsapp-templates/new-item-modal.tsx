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
import { WhatsAppTemplateQuickstart } from "@/components/admin/forms/whatsapp-template-quickstart";
import { Plus } from "lucide-react";

interface NewItemModalProps {
  onSuccess?: () => void;
}

export function NewItemModal({ onSuccess }: NewItemModalProps) {
  const [open, setOpen] = useState(false);
  const [showQuickstart, setShowQuickstart] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [usageType, setUsageType] = useState<string>("GENERAL");

  const handleSuccess = () => {
    setOpen(false);
    setShowQuickstart(true);
    setSelectedTemplate("");
    onSuccess?.();
  };

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
    setShowQuickstart(false);
    // Keep modal open to show the form with the selected template
  };

  const handleClose = () => {
    setOpen(false);
    setShowQuickstart(true);
    setSelectedTemplate("");
    setUsageType("GENERAL");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
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
          {showQuickstart ? (
            <WhatsAppTemplateQuickstart
              key="quickstart"
              onSelectTemplate={handleSelectTemplate}
              onClose={() => setShowQuickstart(false)}
              usageType={usageType}
              onUsageTypeChange={setUsageType}
            />
          ) : (
            <WhatsAppTemplateForm
              key="new-template"
              onSuccess={handleSuccess}
              initialTemplate={selectedTemplate}
              onBackToExamples={() => setShowQuickstart(true)}
              initialUsageType={usageType}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
