"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

async function fetchDestinations() {
  const res = await fetch(`/api/destinations?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load destinations");
  return res.json();
}

export default function CmsDestinationsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "destinations", { page: 1, pageSize: 20 }],
    queryFn: fetchDestinations,
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Destinations</h1>
        <Button asChild size="sm">
          <Link href="/cms/destinations/new">New Destination</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Country</th>
                    <th className="px-3 py-2 text-left">City</th>
                    <th className="px-3 py-2 text-left">Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d: any) => (
                    <tr key={d.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/destinations/${d.id}`}
                          className="underline"
                        >
                          {d.country}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{d.city}</td>
                      <td className="px-3 py-2">
                        {d.isFeatured ? (
                          <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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
