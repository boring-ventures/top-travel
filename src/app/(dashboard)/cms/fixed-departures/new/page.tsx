"use client";

import { useRouter } from "next/navigation";
import { FixedDepartureForm } from "@/components/admin/forms/fixed-departure-form";

export default function NewFixedDeparturePage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Fixed Departure</h1>
      <FixedDepartureForm
        onSuccess={() => router.push("/cms/fixed-departures")}
      />
    </div>
  );
}
