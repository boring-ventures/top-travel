"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NewFixedDepartureModal,
  EditFixedDepartureModal,
  ViewFixedDepartureModal,
  DeleteFixedDepartureDialog,
} from "@/components/admin/cms/fixed-departures";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

async function fetchFixedDepartures() {
  const res = await fetch(`/api/fixed-departures?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Error al cargar las salidas fijas");
  return res.json();
}

export default function CmsFixedDeparturesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "fixed-departures", { page: 1, pageSize: 20 }],
    queryFn: fetchFixedDepartures,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");

  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFixedDeparture, setSelectedFixedDeparture] =
    useState<any>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((f: any) =>
      [f.title, f.slug]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const handleView = (fixedDeparture: any) => {
    setSelectedFixedDeparture(fixedDeparture);
    setViewModalOpen(true);
  };

  const handleEdit = (fixedDeparture: any) => {
    setSelectedFixedDeparture(fixedDeparture);
    setEditModalOpen(true);
  };

  const handleDelete = (fixedDeparture: any) => {
    setSelectedFixedDeparture(fixedDeparture);
    setDeleteDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Salidas Fijas"
          description="Gestiona horarios de salidas grupales."
          actions={
            <Button onClick={() => setNewModalOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Salida Fija
            </Button>
          }
        >
          <SearchInput
            placeholder="Buscar salidas fijas..."
            onSearch={setSearch}
          />
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar las salidas fijas.
          </div>
        ) : (
          <TableShell
            title="Todas las Salidas Fijas"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No hay salidas fijas que coincidan con tu búsqueda"
                      : "Aún no hay salidas fijas"
                  }
                  description={
                    search
                      ? "Intenta con una consulta diferente."
                      : "Crea tu primera salida fija."
                  }
                  action={
                    <Button onClick={() => setNewModalOpen(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Salida Fija
                    </Button>
                  }
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">Título</th>
                  <th className="px-3 py-2 text-left">Slug</th>
                  <th className="px-3 py-2 text-left">Fechas</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f: any) => (
                  <tr key={f.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <span className="font-medium">{f.title}</span>
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {f.slug || "—"}
                      </code>
                    </td>
                    <td className="px-3 py-2">
                      {new Date(f.startDate).toLocaleDateString("es-ES")} -{" "}
                      {new Date(f.endDate).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(f)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalles</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(f)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar salida fija</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(f)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar salida fija</TooltipContent>
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
        <NewFixedDepartureModal
          open={newModalOpen}
          onOpenChange={setNewModalOpen}
        />

        <EditFixedDepartureModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          fixedDepartureSlug={selectedFixedDeparture?.slug || null}
        />

        <ViewFixedDepartureModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          fixedDepartureSlug={selectedFixedDeparture?.slug || null}
        />

        <DeleteFixedDepartureDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          fixedDepartureSlug={selectedFixedDeparture?.slug || null}
          fixedDepartureTitle={selectedFixedDeparture?.title}
        />
      </div>
    </TooltipProvider>
  );
}
