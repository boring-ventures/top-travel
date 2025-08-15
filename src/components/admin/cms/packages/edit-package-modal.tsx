"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PackageForm } from "@/components/admin/forms/package-form";
import { Edit, Loader2 } from "lucide-react";

interface EditPackageModalProps {
  packageSlug: string;
  onSuccess?: () => void;
}

export function EditPackageModal({
  packageSlug,
  onSuccess,
}: EditPackageModalProps) {
  const [open, setOpen] = useState(false);
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && packageSlug) {
      console.log("Fetching package:", packageSlug);
      setLoading(true);
      setError(null);
      fetch(`/api/packages/${packageSlug}`, {
        credentials: "include",
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
          console.log("Package data:", data);
          setPackageData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch package:", error);
          setError(`Error al cargar el paquete: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, packageSlug]);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setPackageData(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="sm"
        title="Editar paquete"
        onClick={() => {
          console.log("Edit button clicked for package:", packageSlug);
          setOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Editar Paquete
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando paquete...
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
          ) : packageData ? (
            <PackageForm
              onSuccess={handleSuccess}
              initialValues={packageData}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">
                Error al cargar los datos del paquete.
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
