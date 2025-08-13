"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DestinationCreateInput,
  DestinationCreateSchema,
  DestinationUpdateInput,
} from "@/lib/validations/destination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type DestinationFormProps = {
  onSuccess?: () => void;
  initialValues?: Partial<DestinationUpdateInput & { id: string }>;
};

export function DestinationForm({
  onSuccess,
  initialValues,
}: DestinationFormProps) {
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

  useEffect(() => {
    if (initialValues) {
      form.reset({
        slug: (initialValues as any).slug ?? "",
        country: (initialValues as any).country ?? "",
        city: (initialValues as any).city ?? "",
        description: (initialValues as any).description ?? "",
        heroImageUrl: (initialValues as any).heroImageUrl ?? "",
        isFeatured: Boolean((initialValues as any).isFeatured) ?? false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean((initialValues as any)?.id);
      const url = isEdit
        ? `/api/destinations/${(initialValues as any).id}`
        : "/api/destinations";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSuccess?.();
      if (!isEdit) form.reset();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="city-country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            {submitting
              ? "Saving..."
              : initialValues?.id
                ? "Save Changes"
                : "Save Destination"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
