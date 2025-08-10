"use client";

import { useRouter } from "next/navigation";
import { DestinationForm } from "@/components/admin/forms/destination-form";

export default function NewDestinationPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Destination</h1>
      <DestinationForm onSuccess={() => router.push("/cms/destinations")} />
    </div>
  );
}
