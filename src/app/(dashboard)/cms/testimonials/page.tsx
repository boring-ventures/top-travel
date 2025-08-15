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
  NewItemModal,
  EditItemModal,
  ViewItemModal,
  DeleteItemDialog,
} from "@/components/admin/cms/testimonials";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

async function fetchTestimonials() {
  const res = await fetch(`/api/testimonials`);
  if (!res.ok) throw new Error("Failed to load testimonials");
  return res.json();
}

export default function CmsTestimonialsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "testimonials"],
    queryFn: fetchTestimonials,
  });
  const items = data ?? [];
  const [search, setSearch] = useState("");
  
  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t: any) =>
      [t.authorName, t.location, t.status]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const handleView = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setViewModalOpen(true);
  };

  const handleEdit = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setEditModalOpen(true);
  };

  const handleDelete = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <ListHeader
        title="Testimonios"
        description="Recopila y publica comentarios de clientes."
        actions={
          <Button onClick={() => setNewModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Testimonio
          </Button>
        }
      >
        <SearchInput placeholder="Buscar testimonios" onSearch={setSearch} />
      </ListHeader>
      
      {error ? (
        <div className="text-sm text-red-600">Error al cargar los testimonios.</div>
      ) : (
        <TableShell
          title="Todos los Testimonios"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search ? "No hay testimonios que coincidan con tu búsqueda" : "Aún no hay testimonios"
                }
                description={
                  search
                    ? "Intenta con una consulta diferente."
                    : "Crea tu primer testimonio."
                }
                action={
                  <Button onClick={() => setNewModalOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Testimonio
                  </Button>
                }
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Autor</th>
                <th className="px-3 py-2 text-left">Calificación</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2 font-medium">
                    {t.authorName}
                  </td>
                  <td className="px-3 py-2">{t.rating}/5</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
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
                          <TooltipContent>
                            <p>Ver detalles</p>
                          </TooltipContent>
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
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
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
                          <TooltipContent>
                            <p>Eliminar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
        testimonialId={selectedTestimonial?.id || null}
      />
      
      <ViewItemModal 
        open={viewModalOpen} 
        onOpenChange={setViewModalOpen}
        testimonialId={selectedTestimonial?.id || null}
      />
      
      <DeleteItemDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        testimonialId={selectedTestimonial?.id || null}
        testimonialTitle={selectedTestimonial?.authorName}
      />
    </div>
  );
}
