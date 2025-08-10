"use client";

import { useRouter } from "next/navigation";
import { DepartmentForm } from "@/components/admin/forms/department-form";

export default function NewDepartmentPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Department</h1>
      <DepartmentForm onSuccess={() => router.push("/cms/departments")} />
    </div>
  );
}
