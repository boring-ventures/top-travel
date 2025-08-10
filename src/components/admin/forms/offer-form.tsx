"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OfferCreateSchema, OfferCreateInput } from "@/lib/validations/offer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { uploadImageToStorage } from "@/lib/supabase/upload-image";

export function OfferForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<OfferCreateInput>({
    resolver: zodResolver(OfferCreateSchema),
    defaultValues: { title: "", isFeatured: false, status: "DRAFT" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      // If user selected a local image file in future, convert here; for now support URL input.
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSuccess?.();
      form.reset();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...form.register("title")} placeholder="Offer title" />
      </div>
      <div>
        <label className="block text-sm font-medium">Subtitle</label>
        <Input {...form.register("subtitle")} placeholder="Subtitle" />
      </div>
      <div>
        <label className="block text-sm font-medium">Banner Image URL</label>
        <Input {...form.register("bannerImageUrl")} placeholder="https://..." />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...form.register("isFeatured")}
          id="isFeatured"
        />
        <label htmlFor="isFeatured" className="text-sm">
          Featured
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Offer"}
        </Button>
        {form.watch("status") ? (
          <Badge variant="outline" className="ml-2">
            {form.watch("status")}
          </Badge>
        ) : null}
      </div>
    </form>
  );
}
