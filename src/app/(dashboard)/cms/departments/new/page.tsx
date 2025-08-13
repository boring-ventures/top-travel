"use client";

import { useRouter } from "next/navigation";
import { DepartmentForm } from "@/components/admin/forms/department-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewDepartmentPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Department</h1>
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a department</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentForm onSuccess={() => router.push("/cms/departments")} />
        </CardContent>
      </Card>
    </div>
  );
}
