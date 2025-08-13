"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DepartmentForm } from "@/components/admin/forms/department-form";

async function fetchDepartments() {
  const res = await fetch(`/api/departments`);
  if (!res.ok) throw new Error("Failed to load departments");
  return res.json();
}

export default function CmsDepartmentsList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "departments"],
    queryFn: fetchDepartments,
  });
  const items = data ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewType, setViewType] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = items.filter((d: any) =>
      typeFilter === "ALL" ? true : d.type === typeFilter
    );
    if (!q) return base;
    return base.filter((d: any) =>
      [d.type, d.title]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search, typeFilter]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/departments/${deleteTarget}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await queryClient.invalidateQueries({ queryKey: ["cms", "departments"] });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const openView = (type: string) => {
    setViewType(type);
    setViewItem(null);
    setViewLoading(true);
    setViewOpen(true);
  };

  const openEdit = (type: string) => {
    setEditType(type);
    setEditItem(null);
    setEditLoading(true);
    setEditOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    if (viewOpen && viewType) {
      (async () => {
        try {
          const res = await fetch(`/api/departments/${viewType}`);
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
  }, [viewOpen, viewType]);

  useEffect(() => {
    let isMounted = true;
    if (editOpen && editType) {
      (async () => {
        try {
          const res = await fetch(`/api/departments/${editType}`);
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
  }, [editOpen, editType]);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Departments"
        description="Website departments and landing content."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            New Department
          </Button>
        }
      >
        <div className="flex w-full items-center justify-between gap-2">
          <SearchInput placeholder="Search departments" onSearch={setSearch} />
          <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="WEDDINGS">Weddings</TabsTrigger>
              <TabsTrigger value="QUINCEANERA">Quinceañera</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <TableShell
          title="All Departments"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search
                    ? "No departments match your search"
                    : "No departments yet"
                }
                description={
                  search
                    ? "Try a different query."
                    : "Create your first department."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/cms/departments/new">New Department</Link>
                  </Button>
                }
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Hero</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any) => (
                <tr key={d.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <Badge variant="secondary">{d.type}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/cms/departments/${d.type}`}
                      className="underline"
                    >
                      {d.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {d.heroImageUrl ? (
                      <img
                        src={d.heroImageUrl}
                        alt="hero"
                        className="h-8 w-14 rounded object-cover ring-1 ring-border"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete department"
                        onClick={() => {
                          setDeleteTarget(d.type);
                          setConfirmOpen(true);
                        }}
                        disabled={deleting}
                      >
                        <Trash2 />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openView(d.type)}
                      >
                        <Eye /> View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEdit(d.type)}
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
        title="Delete department?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget}.`
            : "This will permanently remove the department."
        }
      />

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Department</DialogTitle>
          </DialogHeader>
          <DepartmentForm
            onSuccess={async () => {
              setCreateOpen(false);
              await queryClient.invalidateQueries({
                queryKey: ["cms", "departments"],
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
            setViewType(null);
            setViewItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Department</DialogTitle>
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
              <div className="flex items-center gap-2 text-base font-medium">
                {viewItem.title}
                <Badge variant="secondary">{viewItem.type}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2 sm:col-span-2">
                  <div className="text-muted-foreground">Intro</div>
                  <div className="whitespace-pre-wrap">
                    {viewItem.intro || "—"}
                  </div>
                  <Separator className="my-2" />
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
            setEditType(null);
            setEditItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-24 w-full bg-muted rounded" />
            </div>
          ) : !editItem ? (
            <div className="text-sm text-muted-foreground">Not found.</div>
          ) : (
            <DepartmentForm
              initialValues={editItem}
              disableType
              onSuccess={async () => {
                setEditOpen(false);
                await queryClient.invalidateQueries({
                  queryKey: ["cms", "departments"],
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
