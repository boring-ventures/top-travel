"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageCreateInput, PageCreateSchema } from "@/lib/validations/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PageForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<PageCreateInput>({
    resolver: zodResolver(PageCreateSchema),
    defaultValues: { slug: "", title: "", status: "DRAFT" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/pages", {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="about" />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input {...form.register("title")} placeholder="About Us" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          className="w-full rounded border px-3 py-2 text-sm"
          {...form.register("status")}
        >
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Page"}
        </Button>
      </div>
    </form>
  );
}

