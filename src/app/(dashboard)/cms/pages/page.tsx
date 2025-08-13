"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";

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
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p: any) =>
      [p.slug, p.title]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

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
      <ListHeader
        title="Pages"
        description="Manage static website pages."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/pages/new">New Page</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search pages" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Pages"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={search ? "No pages match your search" : "No pages yet"}
                description={search ? "Try a different query." : "Create your first page."}
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/pages/new">New Page</Link>
                  </Button>
                }
              />
            ) : null
          }
        >
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
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/cms/pages/${p.slug}`} className="underline">
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
        </TableShell>
      )}
    </div>
  );
}
