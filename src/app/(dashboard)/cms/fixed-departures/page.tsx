"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";

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
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((f: any) =>
      [f.title, f.slug]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Fixed Departures"
        description="Manage group departure schedules."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/fixed-departures/new">New Fixed Departure</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search fixed departures" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Fixed Departures"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search
                    ? "No fixed departures match your search"
                    : "No fixed departures yet"
                }
                description={
                  search
                    ? "Try a different query."
                    : "Create your first fixed departure."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/fixed-departures/new">New Fixed Departure</Link>
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
                <th className="px-3 py-2 text-left">Dates</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f: any) => (
                <tr key={f.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/cms/fixed-departures/${f.slug}`} className="underline">
                      {f.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {new Date(f.startDate).toLocaleDateString()} - {new Date(f.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={f.status} />
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
