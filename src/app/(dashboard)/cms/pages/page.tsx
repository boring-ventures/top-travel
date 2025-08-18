"use client";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import {
  NewItemModal,
  EditItemModal,
  ViewItemModal,
  DeleteItemDialog,
} from "@/components/admin/cms/pages";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

async function fetchPages() {
  const res = await fetch(`/api/pages`);
  if (!res.ok) throw new Error("Failed to load pages");
  const result = await res.json();
  return result.data || [];
}

export default function CmsPagesList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "pages"],
    queryFn: fetchPages,
  });
  const items = Array.isArray(data) ? data : [];
  const [search, setSearch] = useState("");

  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

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

  const handleView = (page: any) => {
    setSelectedPage(page);
    setViewModalOpen(true);
  };

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setEditModalOpen(true);
  };

  const handleDelete = (page: any) => {
    setSelectedPage(page);
    setDeleteDialogOpen(true);
  };

  const handleEditFromView = () => {
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  const handleDeleteFromView = () => {
    setViewModalOpen(false);
    setDeleteDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Páginas"
          description="Gestionar páginas estáticas del sitio web."
          actions={
            <Button
              size="sm"
              onClick={() => setNewModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Página
            </Button>
          }
        >
          <SearchInput placeholder="Buscar páginas" onSearch={setSearch} />
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar las páginas.
          </div>
        ) : (
          <TableShell
            title="Todas las Páginas"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No hay páginas que coincidan con tu búsqueda"
                      : "Aún no hay páginas"
                  }
                  description={
                    search
                      ? "Intenta con una consulta diferente."
                      : "Crea tu primera página."
                  }
                  action={
                    <Button
                      size="sm"
                      onClick={() => setNewModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva Página
                    </Button>
                  }
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">Página</th>
                  <th className="px-3 py-2 text-left">Título</th>
                  <th className="px-3 py-2 text-left">Secciones</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <div>
                        <span className="font-medium">{p.title}</span>
                        <div className="text-xs text-muted-foreground font-mono">
                          /{p.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm">{p.title}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm text-muted-foreground">
                        {p.sectionsJson ? 
                          `${Object.keys(JSON.parse(p.sectionsJson) || {}).length} secciones` :
                          'Sin secciones'
                        }
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(p)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver página</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(p)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar página</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(p)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar página</TooltipContent>
                        </Tooltip>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleStatus(p.slug, p.status)}
                          className="ml-2"
                        >
                          {p.status === "PUBLISHED"
                            ? "Despublicar"
                            : "Publicar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        )}

        {/* Modals */}
        <NewItemModal open={newModalOpen} onOpenChange={setNewModalOpen} />

        <EditItemModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          pageSlug={selectedPage?.slug || null}
        />

        <ViewItemModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          pageSlug={selectedPage?.slug || null}
          onEdit={handleEditFromView}
          onDelete={handleDeleteFromView}
        />

        <DeleteItemDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          pageSlug={selectedPage?.slug || null}
          pageTitle={selectedPage?.title}
        />
      </div>
    </TooltipProvider>
  );
}
