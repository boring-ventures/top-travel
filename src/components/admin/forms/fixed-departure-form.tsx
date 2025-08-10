"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FixedDepartureCreateInput,
  FixedDepartureCreateSchema,
} from "@/lib/validations/fixed-departure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FixedDepartureForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetch("/api/destinations").then((r) => r.json());
        setDestinations(d.items ?? d ?? []);
      } catch {}
    })();
  }, []);

  const form = useForm<FixedDepartureCreateInput>({
    resolver: zodResolver(FixedDepartureCreateSchema),
    defaultValues: {
      slug: "",
      title: "",
      destinationId: "",
      startDate: "",
      endDate: "",
      status: "DRAFT",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/fixed-departures", {
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="unique-slug" />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input {...form.register("title")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Destination</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            {...form.register("destinationId")}
          >
            <option value="">Select...</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.city}, {d.country}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <Input type="date" {...form.register("startDate")} />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <Input type="date" {...form.register("endDate")} />
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
          {submitting ? "Saving..." : "Save Fixed Departure"}
        </Button>
      </div>
    </form>
  );
}

