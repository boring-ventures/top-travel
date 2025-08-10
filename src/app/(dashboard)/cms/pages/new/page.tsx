"use client";

import { useRouter } from "next/navigation";
import { PageForm } from "@/components/admin/forms/page-form";

export default function NewPagePage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Page</h1>
      </div>
      <PageForm onSuccess={() => router.push("/cms/pages")} />
    </div>
  );
}
