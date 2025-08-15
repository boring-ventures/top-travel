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
import { PackageForm } from "@/components/admin/forms/package-form";
import { Plus } from "lucide-react";

interface NewPackageModalProps {
  onSuccess?: () => void;
}

export function NewPackageModal({ onSuccess }: NewPackageModalProps) {
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
          New Package
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Create New Package
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          <PackageForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
