"use client";

import { useRouter } from "next/navigation";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export default function NewTestimonialPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Testimonial</h1>
      <TestimonialForm onSuccess={() => router.push("/cms/testimonials")} />
    </div>
  );
}
