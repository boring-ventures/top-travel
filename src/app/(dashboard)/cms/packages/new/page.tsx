"use client";

import { useRouter } from "next/navigation";
import { PackageForm } from "@/components/admin/forms/package-form";

export default function NewPackagePage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Package</h1>
      <PackageForm onSuccess={() => router.push("/cms/packages")} />
    </div>
  );
}
