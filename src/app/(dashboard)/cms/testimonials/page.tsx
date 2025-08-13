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
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t: any) =>
      [t.authorName, t.location, t.status]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Testimonials"
        description="Collect and publish customer feedback."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/testimonials/new">New Testimonial</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search testimonials" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Testimonials"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search ? "No testimonials match your search" : "No testimonials yet"
                }
                description={
                  search
                    ? "Try a different query."
                    : "Create your first testimonial."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/testimonials/new">New Testimonial</Link>
                  </Button>
                }
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Author</th>
                <th className="px-3 py-2 text-left">Rating</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/cms/testimonials/${t.id}`} className="underline">
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
        </TableShell>
      )}
    </div>
  );
}
