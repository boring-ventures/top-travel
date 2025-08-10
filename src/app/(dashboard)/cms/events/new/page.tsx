"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/admin/forms/event-form";

export default function NewEventPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Event</h1>
      <EventForm onSuccess={() => router.push("/cms/events")} />
    </div>
  );
}
