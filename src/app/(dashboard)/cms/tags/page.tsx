"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NewTagModal,
  EditTagModal,
  ViewTagModal,
  DeleteTagDialog,
} from "@/components/admin/cms/tags";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

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

  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedTagName, setSelectedTagName] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t: any) =>
      [t.name, t.slug, t.type]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "REGION":
        return "Región";
      case "THEME":
        return "Tema";
      case "DEPARTMENT":
        return "Departamento";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REGION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "THEME":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DEPARTMENT":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleView = (tag: any) => {
    setSelectedTagId(tag.id);
    setViewModalOpen(true);
  };

  const handleEdit = (tag: any) => {
    setSelectedTagId(tag.id);
    setEditModalOpen(true);
  };

  const handleDelete = (tag: any) => {
    setSelectedTagId(tag.id);
    setSelectedTagName(tag.name);
    setDeleteDialogOpen(true);
  };

  const handleEditFromView = () => {
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Etiquetas"
          description="Clasifica el contenido con etiquetas."
          actions={
            <Button
              onClick={() => setNewModalOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Etiqueta
            </Button>
          }
        >
          <SearchInput placeholder="Buscar etiquetas" onSearch={setSearch} />
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar las etiquetas.
          </div>
        ) : (
          <TableShell
            title="Todas las Etiquetas"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No hay etiquetas que coincidan con tu búsqueda"
                      : "No hay etiquetas aún"
                  }
                  description={
                    search
                      ? "Intenta con una consulta diferente."
                      : "Crea tu primera etiqueta."
                  }
                  action={
                    <Button
                      onClick={() => setNewModalOpen(true)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva Etiqueta
                    </Button>
                  }
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Slug</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t: any) => (
                  <tr key={t.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2 font-medium">{t.name}</td>
                    <td className="px-3 py-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                      {t.slug}
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={getTypeColor(t.type)}>
                        {getTypeLabel(t.type)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(t)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver etiqueta</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(t)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar etiqueta</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(t)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar etiqueta</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        )}

        {/* Modals */}
        <NewTagModal open={newModalOpen} onOpenChange={setNewModalOpen} />

        <EditTagModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          tagId={selectedTagId}
        />

        <ViewTagModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          tagId={selectedTagId}
          onEdit={handleEditFromView}
        />

        <DeleteTagDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          tagId={selectedTagId}
          tagName={selectedTagName}
        />
      </div>
    </TooltipProvider>
  );
}
