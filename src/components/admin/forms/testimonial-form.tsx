"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TestimonialCreateInput,
  TestimonialCreateSchema,
} from "@/lib/validations/testimonial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function TestimonialForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<TestimonialCreateInput>({
    resolver: zodResolver(TestimonialCreateSchema),
    defaultValues: {
      authorName: "",
      location: "",
      rating: 5,
      content: "",
      status: "PENDING",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
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
          <label className="block text-sm font-medium">Author</label>
          <Input {...form.register("authorName")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input {...form.register("location")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Rating</label>
          <Input
            type="number"
            min={1}
            max={5}
            {...form.register("rating", { valueAsNumber: true })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Content</label>
        <Textarea {...form.register("content")} />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          className="w-full rounded border px-3 py-2 text-sm"
          {...form.register("status")}
        >
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Testimonial"}
        </Button>
      </div>
    </form>
  );
}

