"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Clock } from "lucide-react";
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

  const handleApprove = async (testimonial: any) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      });
      if (res.ok) {
        // Refetch data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  const handleReject = async (testimonial: any) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Refetch data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
    }
  };

  const handlePublish = async (testimonial: any) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' })
      });
      if (res.ok) {
        // Refetch data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error publishing testimonial:', error);
    }
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
                <th className="px-3 py-2 text-left">Ubicación</th>
                <th className="px-3 py-2 text-left">Calificación</th>
                <th className="px-3 py-2 text-left">Contenido</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Moderación</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <span className="font-medium">{t.authorName}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-muted-foreground">
                      {t.location || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < t.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm ml-1">({t.rating})</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                      {t.content}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    {t.status === 'PENDING' && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                    {t.status === 'APPROVED' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Check className="h-3 w-3 mr-1" />
                        Aprobado
                      </Badge>
                    )}
                    {t.status === 'PUBLISHED' && (
                      <Badge variant="default" className="bg-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Publicado
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {t.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
                          onClick={() => handleApprove(t)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(t)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {t.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-green-600 hover:bg-green-50"
                        onClick={() => handlePublish(t)}
                      >
                        Publicar
                      </Button>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
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
