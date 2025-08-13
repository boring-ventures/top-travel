"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DestinationForm } from "@/components/admin/forms/destination-form";

async function fetchDestinations() {
  const res = await fetch(`/api/destinations?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load destinations");
  return res.json();
}

export default function CmsDestinationsList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "destinations", { page: 1, pageSize: 20 }],
    queryFn: fetchDestinations,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((d: any) =>
      [d.country, d.city, d.slug].some((v: string) =>
        (v ?? "").toLowerCase().includes(q)
      )
    );
  }, [items, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/destinations/${deleteTarget}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await queryClient.invalidateQueries({
        queryKey: ["cms", "destinations"],
      });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const openView = (id: string) => {
    setViewId(id);
    setViewItem(null);
    setViewLoading(true);
    setViewOpen(true);
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setEditItem(null);
    setEditLoading(true);
    setEditOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    if (viewOpen && viewId) {
      (async () => {
        try {
          const res = await fetch(`/api/destinations/${viewId}`);
          if (res.ok) {
            const json = await res.json();
            if (isMounted) setViewItem(json);
          }
        } finally {
          if (isMounted) setViewLoading(false);
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [viewOpen, viewId]);

  useEffect(() => {
    let isMounted = true;
    if (editOpen && editId) {
      (async () => {
        try {
          const res = await fetch(`/api/destinations/${editId}`);
          if (res.ok) {
            const json = await res.json();
            if (isMounted) setEditItem(json);
          }
        } finally {
          if (isMounted) setEditLoading(false);
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [editOpen, editId]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Destinations"
        description="Manage destination cities and countries."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            New Destination
          </Button>
        }
      >
        <SearchInput
          placeholder="Search by city, country or slug"
          onSearch={setSearch}
        />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Destinations"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search
                    ? "No destinations match your search"
                    : "No destinations yet"
                }
                description={
                  search
                    ? "Try a different query."
                    : "Create your first destination to get started."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/destinations/new">New Destination</Link>
                  </Button>
                }
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Country</th>
                <th className="px-3 py-2 text-left">City</th>
                <th className="px-3 py-2 text-left">Featured</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any) => (
                <tr key={d.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">{d.country}</td>
                  <td className="px-3 py-2">{d.city}</td>
                  <td className="px-3 py-2">
                    {d.isFeatured ? (
                      <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        Featured
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete destination"
                        onClick={() => {
                          setDeleteTarget(d.id);
                          setConfirmOpen(true);
                        }}
                        disabled={deleting}
                      >
                        <Trash2 />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => openView(d.id)}
                      >
                        <Eye /> View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => openEdit(d.id)}
                      >
                        <Pencil /> Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete destination?"
        description={
          deleteTarget
            ? `This will permanently remove the destination.`
            : "This will permanently remove the destination."
        }
      />

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Destination</DialogTitle>
          </DialogHeader>
          <DestinationForm
            onSuccess={async () => {
              setCreateOpen(false);
              await queryClient.invalidateQueries({
                queryKey: ["cms", "destinations"],
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) {
            setViewId(null);
            setViewItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Destination</DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-24 w-full bg-muted rounded" />
            </div>
          ) : !viewItem ? (
            <div className="text-sm text-muted-foreground">Not found.</div>
          ) : (
            <div className="space-y-4">
              <div className="text-base font-medium">
                {viewItem.city}, {viewItem.country}
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2 sm:col-span-2">
                  <div className="text-muted-foreground">Slug</div>
                  <div className="break-all">{viewItem.slug || "—"}</div>
                  <div className="text-muted-foreground">Description</div>
                  <div className="whitespace-pre-wrap">
                    {viewItem.description || "—"}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-muted-foreground">Featured</div>
                  <div>{viewItem.isFeatured ? "Yes" : "No"}</div>
                  <div className="text-muted-foreground">Created</div>
                  <div>{new Date(viewItem.createdAt).toLocaleString()}</div>
                  <div className="text-muted-foreground">Updated</div>
                  <div>{new Date(viewItem.updatedAt).toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground">Hero Image</div>
                  {viewItem.heroImageUrl ? (
                    <a
                      href={viewItem.heroImageUrl}
                      target="_blank"
                      className="block"
                    >
                      <img
                        src={viewItem.heroImageUrl}
                        alt="hero"
                        className="h-32 w-full rounded object-cover ring-1 ring-border"
                      />
                    </a>
                  ) : (
                    <div className="text-muted-foreground">—</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setEditId(null);
            setEditItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
          </DialogHeader>
          {editLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-24 w-full bg-muted rounded" />
            </div>
          ) : !editItem ? (
            <div className="text-sm text-muted-foreground">Not found.</div>
          ) : (
            <DestinationForm
              initialValues={editItem}
              onSuccess={async () => {
                setEditOpen(false);
                await queryClient.invalidateQueries({
                  queryKey: ["cms", "destinations"],
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
