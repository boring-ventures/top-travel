"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";

async function fetchTemplates() {
  const res = await fetch(`/api/whatsapp-templates?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load WhatsApp templates");
  return res.json();
}

export default function CmsWhatsAppTemplatesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "whatsapp-templates", { page: 1, pageSize: 20 }],
    queryFn: fetchTemplates,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t: any) =>
      [t.name]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="WhatsApp Templates"
        description="Preset messages to share via WhatsApp."
        actions={
          <Button asChild size="sm">
            <Link href="/cms/whatsapp-templates/new">New Template</Link>
          </Button>
        }
      >
        <SearchInput placeholder="Search templates" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All WhatsApp Templates"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search
                    ? "No templates match your search"
                    : "No templates yet"
                }
                description={
                  search ? "Try a different query." : "Create your first template."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/whatsapp-templates/new">New Template</Link>
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
                <th className="px-3 py-2 text-left">Default</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-t">
                  <td className="px-3 py-2">
                    <Link href={`/cms/whatsapp-templates/${t.id}`} className="underline">
                      {t.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{t.isDefault ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </div>
  );
}
