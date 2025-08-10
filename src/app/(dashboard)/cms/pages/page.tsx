"use client";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

async function fetchPages() {
  const res = await fetch(`/api/pages`);
  if (!res.ok) throw new Error("Failed to load pages");
  return res.json();
}

export default function CmsPagesList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "pages"],
    queryFn: fetchPages,
  });
  const items = data ?? [];

  const handleToggleStatus = async (slug: string, current: string) => {
    const next = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await fetch(`/api/pages/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) queryClient.invalidateQueries({ queryKey: ["cms", "pages"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pages</h1>
        <Button asChild size="sm">
          <Link href="/cms/pages/new">New Page</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Slug</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p: any) => (
                    <tr key={p.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/pages/${p.slug}`}
                          className="underline"
                        >
                          {p.slug}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{p.title}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleStatus(p.slug, p.status)}
                        >
                          {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
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
