"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DepartmentCreateInput,
  DepartmentCreateSchema,
} from "@/lib/validations/department";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function DepartmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<DepartmentCreateInput>({
    resolver: zodResolver(DepartmentCreateSchema),
    defaultValues: {
      type: "WEDDINGS",
      title: "",
      intro: "",
      heroImageUrl: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/departments", {
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
          <label className="block text-sm font-medium">Type</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            {...form.register("type")}
          >
            <option value="WEDDINGS">WEDDINGS</option>
            <option value="QUINCEANERA">QUINCEANERA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input {...form.register("title")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Intro</label>
        <Input {...form.register("intro")} />
      </div>
      <div>
        <label className="block text-sm font-medium">Hero Image URL</label>
        <Input {...form.register("heroImageUrl")} placeholder="https://..." />
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Department"}
        </Button>
      </div>
    </form>
  );
}

