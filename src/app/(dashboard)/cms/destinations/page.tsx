"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import { CmsAuthGuard } from "@/components/admin/cms-auth-guard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NewDestinationModal,
  EditDestinationModal,
  ViewDestinationModal,
  DeleteDestinationDialog,
} from "@/components/admin/cms/destinations";
import { Eye, Edit, Trash2, Plus, Star } from "lucide-react";

async function fetchDestinations() {
  const res = await fetch(`/api/destinations?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Error al cargar los destinos");
  return res.json();
}

function CmsDestinationsListContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "destinations", { page: 1, pageSize: 20 }],
    queryFn: fetchDestinations,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");

  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((d: any) =>
      [d.country, d.city, d.slug].some((v: string) =>
        (v ?? "").toLowerCase().includes(q)
      )
    );
  }, [items, search]);

  const handleView = (destination: any) => {
    setSelectedDestination(destination);
    setViewModalOpen(true);
  };

  const handleEdit = (destination: any) => {
    setSelectedDestination(destination);
    setEditModalOpen(true);
  };

  const handleDelete = (destination: any) => {
    setSelectedDestination(destination);
    setDeleteDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Destinos"
          description="Gestiona ciudades y países de destino."
          actions={
            <Button size="sm" onClick={() => setNewModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Destino
            </Button>
          }
        >
          <SearchInput
            placeholder="Buscar por ciudad, país o slug"
            onSearch={setSearch}
          />
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar los destinos.
          </div>
        ) : (
          <TableShell
            title="Todos los Destinos"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No se encontraron destinos"
                      : "Aún no hay destinos"
                  }
                  description={
                    search
                      ? "Intenta con otra búsqueda."
                      : "Crea tu primer destino."
                  }
                  action={
                    <Button size="sm" onClick={() => setNewModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Destino
                    </Button>
                  }
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">País</th>
                  <th className="px-3 py-2 text-left">Ciudad</th>
                  <th className="px-3 py-2 text-left">Slug</th>
                  <th className="px-3 py-2 text-left">Destacado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d: any) => (
                  <tr key={d.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <span className="font-medium">{d.country}</span>
                    </td>
                    <td className="px-3 py-2">{d.city}</td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {d.slug}
                      </code>
                    </td>
                    <td className="px-3 py-2">
                      {d.isFeatured ? (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3" />
                          Destacado
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(d)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalles</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(d)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(d)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar</TooltipContent>
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
        <NewDestinationModal
          open={newModalOpen}
          onOpenChange={setNewModalOpen}
        />
        <EditDestinationModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          destinationId={selectedDestination?.id || null}
        />
        <ViewDestinationModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          destinationId={selectedDestination?.id || null}
        />
        <DeleteDestinationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          destinationId={selectedDestination?.id || null}
          destinationName={
            selectedDestination
              ? `${selectedDestination.city}, ${selectedDestination.country}`
              : undefined
          }
        />
      </div>
    </TooltipProvider>
  );
}

export default function CmsDestinationsList() {
  return (
    <CmsAuthGuard>
      <CmsDestinationsListContent />
    </CmsAuthGuard>
  );
}
