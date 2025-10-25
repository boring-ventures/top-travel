"use client";
import { useMemo, useState } from "react";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const res = await fetch(`/api/events?page=1&pageSize=100`); // Increased from 20 to 100
  if (!res.ok) throw new Error("Error al cargar los eventos");
  return res.json();
}

export default function CmsEventsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "events", { page: 1, pageSize: 100 }], // Updated to match the new pageSize
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
      [
        e.title,
        e.artistOrEvent,
        e.category,
        e.destination?.city,
        e.destination?.country,
        e.slug,
      ]
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
                  <th className="px-3 py-2 text-left">Evento</th>
                  <th className="px-3 py-2 text-left">Artista/Evento</th>
                  <th className="px-3 py-2 text-left">Categoría</th>
                  <th className="px-3 py-2 text-left">Ubicación</th>
                  <th className="px-3 py-2 text-left">Etiquetas</th>
                  <th className="px-3 py-2 text-left">Fechas</th>
                  <th className="px-3 py-2 text-left">Precio</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: any) => (
                  <tr key={e.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <div>
                        <span className="font-medium">{e.title}</span>
                        <div className="text-xs text-muted-foreground">
                          {e.slug || "Sin slug"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm">{e.artistOrEvent || "—"}</span>
                    </td>
                    <td className="px-3 py-2">
                      {e.category ? (
                        <Badge
                          variant="outline"
                          className={
                            e.category === "MUSIC"
                              ? "border-blue-200 text-blue-700 bg-blue-50"
                              : e.category === "SPORTS"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : e.category === "SPECIAL"
                                  ? "border-purple-200 text-purple-700 bg-purple-50"
                                  : ""
                          }
                        >
                          {e.category === "MUSIC"
                            ? "Música"
                            : e.category === "SPORTS"
                              ? "Deportes"
                              : e.category === "SPECIAL"
                                ? "Especiales"
                                : e.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        {e.venue && (
                          <div className="font-medium">{e.venue}</div>
                        )}
                        <div className="text-muted-foreground">
                          {e.destination
                            ? `${e.destination.city}, ${e.destination.country}`
                            : "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {e.tags && e.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {e.tags.map((tag: any) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        <div>
                          {new Date(e.startDate).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {e.startDate !== e.endDate && (
                          <div className="text-muted-foreground">
                            hasta{" "}
                            {new Date(e.endDate).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {e.fromPrice ? (
                        <span className="text-sm font-medium">
                          {formatPriceWithCurrency(
                            e.fromPrice,
                            e.currency,
                            false
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
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
