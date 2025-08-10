"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";

async function fetchFixedDepartures() {
  const res = await fetch(`/api/fixed-departures?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load fixed departures");
  return res.json();
}

export default function CmsFixedDeparturesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "fixed-departures", { page: 1, pageSize: 20 }],
    queryFn: fetchFixedDepartures,
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Fixed Departures</h1>
        <Button asChild size="sm">
          <Link href="/cms/fixed-departures/new">New Fixed Departure</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Fixed Departures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Dates</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((f: any) => (
                    <tr key={f.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/fixed-departures/${f.slug}`}
                          className="underline"
                        >
                          {f.title}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        {new Date(f.startDate).toLocaleDateString()} -{" "}
                        {new Date(f.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={f.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
