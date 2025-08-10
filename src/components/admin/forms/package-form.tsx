"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PackageCreateInput,
  PackageCreateSchema,
} from "@/lib/validations/package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PackageForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [d, t] = await Promise.all([
          fetch("/api/destinations").then((r) => r.json()),
          fetch("/api/tags").then((r) => r.json()),
        ]);
        setDestinations(d.items ?? d ?? []);
        setTags(t ?? []);
      } catch {
        // no-op
      }
    })();
  }, []);

  const form = useForm<PackageCreateInput>({
    resolver: zodResolver(PackageCreateSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      heroImageUrl: "",
      inclusions: [],
      exclusions: [],
      isCustom: false,
      status: "DRAFT",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/packages", {
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="unique-slug" />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input {...form.register("title")} placeholder="Package title" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Summary</label>
        <Textarea {...form.register("summary")} placeholder="Short summary" />
      </div>
      <div>
        <label className="block text-sm font-medium">Hero Image URL</label>
        <Input {...form.register("heroImageUrl")} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Duration (days)</label>
          <Input
            type="number"
            {...form.register("durationDays", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">From Price</label>
          <Input
            type="number"
            step="0.01"
            {...form.register("fromPrice", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            {...form.register("currency")}
          >
            <option value="">-</option>
            <option value="BOB">BOB</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Destinations</label>
          <select
            multiple
            className="w-full rounded border px-3 py-2 text-sm h-28"
            {...form.register("destinationIds")}
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.city}, {d.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <select
            multiple
            className="w-full rounded border px-3 py-2 text-sm h-28"
            {...form.register("tagIds")}
          >
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isCustom" {...form.register("isCustom")} />
          <label htmlFor="isCustom" className="text-sm">
            Custom package
          </label>
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
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Package"}
        </Button>
      </div>
    </form>
  );
}

