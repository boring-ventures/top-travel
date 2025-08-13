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

async function fetchPackages() {
  const res = await fetch(`/api/packages?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load packages");
  return res.json();
}

export default function CmsPackagesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "packages", { page: 1, pageSize: 20 }],
    queryFn: fetchPackages,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p: any) =>
      [p.title, p.slug, p.currency]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Packages"
        description="Create and manage travel packages."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/packages/new">New Package</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search packages" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Packages"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={search ? "No packages match your search" : "No packages yet"}
                description={
                  search ? "Try a different query." : "Create your first package."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/packages/new">New Package</Link>
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
                <th className="px-3 py-2 text-left">Custom</th>
                <th className="px-3 py-2 text-left">From Price</th>
                <th className="px-3 py-2 text-left">Currency</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Link href={`/cms/packages/${p.slug}`} className="underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{p.isCustom ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{p.fromPrice ?? "-"}</td>
                  <td className="px-3 py-2">{p.currency ?? "-"}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={p.status} />
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
