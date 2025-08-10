"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";

async function fetchTestimonials() {
  const res = await fetch(`/api/testimonials`);
  if (!res.ok) throw new Error("Failed to load testimonials");
  return res.json();
}

export default function CmsTestimonialsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "testimonials"],
    queryFn: fetchTestimonials,
  });
  const items = data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Testimonials</h1>
        <Button asChild size="sm">
          <Link href="/cms/testimonials/new">New Testimonial</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Author</th>
                    <th className="px-3 py-2 text-left">Rating</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t: any) => (
                    <tr key={t.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/testimonials/${t.id}`}
                          className="underline"
                        >
                          {t.authorName}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{t.rating}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={t.status} />
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
