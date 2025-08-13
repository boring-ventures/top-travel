"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";

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
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((o: any) =>
      [o.title, o.subtitle]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Offers"
        description="Create promotional offers for campaigns."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/offers/new">New Offer</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search offers" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Offers"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={search ? "No offers match your search" : "No offers yet"}
                description={
                  search ? "Try a different query." : "Create your first offer."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/offers/new">New Offer</Link>
                  </Button>
                }
              />
            ) : null
          }
        >
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
              {filtered.map((o: any) => (
                <tr key={o.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/cms/offers/${o.id}`} className="underline">
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
                    {o.startAt ? new Date(o.startAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2">
                    {o.endAt ? new Date(o.endAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </div>
  );
}
