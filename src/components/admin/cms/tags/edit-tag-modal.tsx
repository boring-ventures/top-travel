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
import { TagForm } from "@/components/admin/forms/tag-form";

interface EditTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: string | null;
}

export function EditTagModal({ open, onOpenChange, tagId }: EditTagModalProps) {
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tag data when modal opens
  useEffect(() => {
    if (open && tagId) {
      setLoading(true);
      fetch(`/api/tags/${tagId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar la etiqueta");
          return res.json();
        })
        .then((data) => {
          setTag(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Error al cargar la etiqueta",
            variant: "destructive",
          });
          onOpenChange(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, tagId, toast, onOpenChange]);

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
            <Edit className="h-5 w-5" />
            Editar Etiqueta
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando etiqueta...</span>
            </div>
          </div>
        ) : tag ? (
          <div className="px-2">
            <TagForm initialValues={tag} onSuccess={handleSuccess} />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No se pudo cargar la etiqueta
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
