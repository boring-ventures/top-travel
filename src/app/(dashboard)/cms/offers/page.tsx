"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";

async function fetchOffers() {
  const res = await fetch(`/api/offers?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load offers");
  return res.json();
}

export default function CmsOffersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "offers", { page: 1, pageSize: 20 }],
    queryFn: fetchOffers,
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Offers</h1>
        <Button asChild size="sm">
          <Link href="/cms/offers/new">New Offer</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Featured</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Start</th>
                    <th className="px-3 py-2 text-left">End</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((o: any) => (
                    <tr key={o.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/offers/${o.id}`}
                          className="underline"
                        >
                          {o.title}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        {o.isFeatured ? (
                          <Badge variant="secondary">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-3 py-2">
                        {o.startAt
                          ? new Date(o.startAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {o.endAt ? new Date(o.endAt).toLocaleDateString() : "-"}
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
