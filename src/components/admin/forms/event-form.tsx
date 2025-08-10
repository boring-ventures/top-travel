"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateInput, EventCreateSchema } from "@/lib/validations/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<EventCreateInput>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues: {
      slug: "",
      title: "",
      artistOrEvent: "",
      locationCity: "",
      locationCountry: "",
      venue: "",
      startDate: "",
      endDate: "",
      status: "DRAFT",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
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
          <label className="block text-sm font-medium">Artist / Event</label>
          <Input {...form.register("artistOrEvent")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">City</label>
          <Input {...form.register("locationCity")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <Input {...form.register("locationCountry")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Venue</label>
          <Input {...form.register("venue")} />
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
          {submitting ? "Saving..." : "Save Event"}
        </Button>
      </div>
    </form>
  );
}

