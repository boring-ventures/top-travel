"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagCreateInput, TagCreateSchema } from "@/lib/validations/tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function TagForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<TagCreateInput>({
    resolver: zodResolver(TagCreateSchema),
    defaultValues: { name: "", slug: "", type: "REGION" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/tags", {
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
          <label className="block text-sm font-medium">Name</label>
          <Input {...form.register("name")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="url-safe" />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            {...form.register("type")}
          >
            <option value="REGION">REGION</option>
            <option value="THEME">THEME</option>
            <option value="DEPARTMENT">DEPARTMENT</option>
          </select>
        </div>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Tag"}
        </Button>
      </div>
    </form>
  );
}

