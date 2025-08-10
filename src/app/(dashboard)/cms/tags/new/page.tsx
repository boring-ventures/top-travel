"use client";

import { useRouter } from "next/navigation";
import { TagForm } from "@/components/admin/forms/tag-form";

export default function NewTagPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Tag</h1>
      <TagForm onSuccess={() => router.push("/cms/tags")} />
    </div>
  );
}
