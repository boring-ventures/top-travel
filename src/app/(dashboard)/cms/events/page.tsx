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

async function fetchEvents() {
  const res = await fetch(`/api/events?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export default function CmsEventsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "events", { page: 1, pageSize: 20 }],
    queryFn: fetchEvents,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((e: any) =>
      [e.title, e.artistOrEvent, e.locationCity, e.locationCountry, e.slug]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Events"
        description="Plan and publish event departures."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/events/new">New Event</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search events" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Events"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={search ? "No events match your search" : "No events yet"}
                description={
                  search ? "Try a different query." : "Create your first event."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/events/new">New Event</Link>
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
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Dates</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e: any) => (
                <tr key={e.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/cms/events/${e.slug}`} className="underline">
                      {e.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={e.status} />
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
