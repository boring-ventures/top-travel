"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WhatsAppTemplateForm } from "@/components/admin/forms/whatsapp-template-form";
import { Edit, Loader2 } from "lucide-react";

interface EditItemModalProps {
  templateId: string;
  onSuccess?: () => void;
}

export function EditItemModal({ templateId, onSuccess }: EditItemModalProps) {
  const [open, setOpen] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && templateId) {
      setLoading(true);
      setError(null);
      fetch(`/api/whatsapp-templates/${templateId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setTemplateData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch template:", error);
          setError(`Error al cargar la plantilla: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, templateId]);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTemplateData(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="sm"
        title="Editar plantilla"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Editar Plantilla de WhatsApp
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando plantilla...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">{error}</div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          ) : templateData ? (
            <WhatsAppTemplateForm
              key={templateData.id}
              onSuccess={handleSuccess}
              initialValues={templateData}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">
                Error al cargar los datos de la plantilla.
              </div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
