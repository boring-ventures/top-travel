"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";

async function fetchPackages() {
  const res = await fetch(`/api/packages?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load packages");
  return res.json();
}

export default function CmsPackagesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "packages", { page: 1, pageSize: 20 }],
    queryFn: fetchPackages,
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Packages</h1>
        <Button asChild size="sm">
          <Link href="/cms/packages/new">New Package</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Custom</th>
                    <th className="px-3 py-2 text-left">From Price</th>
                    <th className="px-3 py-2 text-left">Currency</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p: any) => (
                    <tr key={p.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/packages/${p.slug}`}
                          className="underline"
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{p.isCustom ? "Yes" : "No"}</td>
                      <td className="px-3 py-2">{p.fromPrice ?? "-"}</td>
                      <td className="px-3 py-2">{p.currency ?? "-"}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={p.status} />
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
