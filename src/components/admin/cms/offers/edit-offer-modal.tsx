"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfferForm } from "@/components/admin/forms/offer-form";
import { Edit, Loader2 } from "lucide-react";

interface EditOfferModalProps {
  offerId: string;
  onSuccess?: () => void;
}

export function EditOfferModal({ offerId, onSuccess }: EditOfferModalProps) {
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && offerId) {
      console.log("Fetching offer:", offerId);
      setLoading(true);
      setError(null);
      fetch(`/api/offers/${offerId}`, {
        credentials: "include", // Ensure cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("Response status:", res.status);
          console.log("Response headers:", res.headers);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Offer data:", data);
          setOffer(data);
        })
        .catch((error) => {
          console.error("Failed to fetch offer:", error);
          setError(`Error al cargar la oferta: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, offerId]);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setOffer(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="sm"
        title="Editar oferta"
        onClick={() => {
          console.log("Edit button clicked for offer:", offerId);
          setOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Editar Oferta
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando oferta...
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
          ) : offer ? (
            <OfferForm onSuccess={handleSuccess} initialValues={offer} />
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">
                Error al cargar los datos de la oferta.
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
