"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

async function fetchTags() {
  const res = await fetch(`/api/tags`);
  if (!res.ok) throw new Error("Failed to load tags");
  return res.json();
}

export default function CmsTagsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "tags"],
    queryFn: fetchTags,
  });
  const items = data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tags</h1>
        <Button asChild size="sm">
          <Link href="/cms/tags/new">New Tag</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Slug</th>
                    <th className="px-3 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t: any) => (
                    <tr key={t.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link href={`/cms/tags/${t.id}`} className="underline">
                          {t.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{t.slug}</td>
                      <td className="px-3 py-2">{t.type}</td>
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
