"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DestinationCreateInput,
  DestinationCreateSchema,
} from "@/lib/validations/destination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function DestinationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<DestinationCreateInput>({
    resolver: zodResolver(DestinationCreateSchema),
    defaultValues: {
      slug: "",
      country: "",
      city: "",
      description: "",
      heroImageUrl: "",
      isFeatured: false,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/destinations", {
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="city-country" />
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <Input {...form.register("country")} />
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <Input {...form.register("city")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input {...form.register("description")} />
      </div>
      <div>
        <label className="block text-sm font-medium">Hero Image URL</label>
        <Input {...form.register("heroImageUrl")} placeholder="https://..." />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFeatured"
          {...form.register("isFeatured")}
        />
        <label htmlFor="isFeatured" className="text-sm">
          Featured
        </label>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Destination"}
        </Button>
      </div>
    </form>
  );
}

