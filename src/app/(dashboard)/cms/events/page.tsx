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
  NewEventModal,
  EditEventModal,
  ViewEventModal,
  DeleteEventDialog,
} from "@/components/admin/cms/events";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

async function fetchEvents() {
  const res = await fetch(`/api/events?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Error al cargar los eventos");
  return res.json();
}

export default function CmsEventsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "events", { page: 1, pageSize: 20 }],
    queryFn: fetchEvents,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");

  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((e: any) =>
      [e.title, e.artistOrEvent, e.locationCity, e.locationCountry, e.slug]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const handleView = (event: any) => {
    setSelectedEvent(event);
    setViewModalOpen(true);
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const handleDelete = (event: any) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Eventos"
          description="Planifica y publica salidas de eventos."
          actions={
            <Button onClick={() => setNewModalOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          }
        >
          <SearchInput placeholder="Buscar eventos..." onSearch={setSearch} />
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar los eventos.
          </div>
        ) : (
          <TableShell
            title="Todos los Eventos"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No hay eventos que coincidan con tu búsqueda"
                      : "Aún no hay eventos"
                  }
                  description={
                    search
                      ? "Intenta con una consulta diferente."
                      : "Crea tu primer evento."
                  }
                  action={
                    <Button onClick={() => setNewModalOpen(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Evento
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
                  <th className="px-3 py-2 text-left">Ubicación</th>
                  <th className="px-3 py-2 text-left">Fechas</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: any) => (
                  <tr key={e.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <span className="font-medium">{e.title}</span>
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {e.slug || "—"}
                      </code>
                    </td>
                    <td className="px-3 py-2">
                      {e.locationCity ?? "-"}, {e.locationCountry ?? "-"}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(e.startDate).toLocaleDateString("es-ES")} -{" "}
                      {new Date(e.endDate).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(e)}
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
                              onClick={() => handleEdit(e)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar evento</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(e)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar evento</TooltipContent>
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
        <NewEventModal open={newModalOpen} onOpenChange={setNewModalOpen} />

        <EditEventModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          eventSlug={selectedEvent?.slug || null}
        />

        <ViewEventModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          eventSlug={selectedEvent?.slug || null}
        />

        <DeleteEventDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          eventSlug={selectedEvent?.slug || null}
          eventTitle={selectedEvent?.title}
        />
      </div>
    </TooltipProvider>
  );
}
