"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";

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
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t: any) =>
      [t.name, t.slug, t.type]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Tags"
        description="Classify content with tags."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/tags/new">New Tag</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search tags" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Tags"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={search ? "No tags match your search" : "No tags yet"}
                description={
                  search ? "Try a different query." : "Create your first tag."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/tags/new">New Tag</Link>
                  </Button>
                }
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Slug</th>
                <th className="px-3 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
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
        </TableShell>
      )}
    </div>
  );
}
