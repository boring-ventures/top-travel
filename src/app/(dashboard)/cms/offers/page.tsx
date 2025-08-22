"use client";
import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import {
  EnhancedSearch,
  SearchFilters,
} from "@/components/admin/cms/enhanced-search";
import {
  NewOfferModal,
  EditOfferModal,
  ViewOfferModal,
  DeleteOfferDialog,
} from "@/components/admin/cms/offers";

async function fetchOffers(filters: SearchFilters) {
  const params = new URLSearchParams({
    page: "1",
    pageSize: "20",
    ...(filters.search && { search: filters.search }),
    ...(filters.status !== "all" && { status: filters.status }),
    ...(filters.featured !== "all" && { featured: filters.featured }),
    ...(filters.dateFilter !== "all" && { dateFilter: filters.dateFilter }),
    ...(filters.displayTag !== "all" && { displayTag: filters.displayTag }),
  });

  const res = await fetch(`/api/offers?${params}`);
  if (!res.ok) throw new Error("Failed to load offers");
  return res.json();
}

export default function CmsOffersList() {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    status: "all",
    featured: "all",
    dateFilter: "all",
    displayTag: "all",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cms", "offers", filters],
    queryFn: () => fetchOffers(filters),
  });

  const items = data?.items ?? [];
  const displayTags = data?.displayTags ?? [];

  const handleSuccess = () => {
    refetch();
  };

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-4">
      <ListHeader
        title="Ofertas"
        description="Crear ofertas promocionales para campañas."
        actions={<NewOfferModal onSuccess={handleSuccess} />}
      >
        <EnhancedSearch
          placeholder="Buscar ofertas..."
          onFiltersChange={handleFiltersChange}
          displayTags={displayTags}
        />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">Error al cargar.</div>
      ) : (
        <TableShell
          title="Todas las Ofertas"
          isLoading={isLoading}
          empty={
            items.length === 0 ? (
              <EmptyState
                title={
                  filters.search ||
                  filters.status !== "all" ||
                  filters.featured !== "all" ||
                  filters.dateFilter !== "all" ||
                  filters.displayTag !== "all"
                    ? "No se encontraron ofertas"
                    : "Aún no hay ofertas"
                }
                description={
                  filters.search ||
                  filters.status !== "all" ||
                  filters.featured !== "all" ||
                  filters.dateFilter !== "all" ||
                  filters.displayTag !== "all"
                    ? "Intenta con otros filtros."
                    : "Crea tu primera oferta."
                }
                action={<NewOfferModal onSuccess={handleSuccess} />}
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Título</th>
                <th className="px-3 py-2 text-left">Etiqueta</th>
                <th className="px-3 py-2 text-left">Destacada</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Inicio</th>
                <th className="px-3 py-2 text-left">Fin</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o: any) => (
                <tr key={o.id} className="border-t hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <span className="font-medium">{o.title}</span>
                  </td>
                  <td className="px-3 py-2">
                    {o.displayTag ? (
                      <Badge variant="outline" className="text-xs">
                        {o.displayTag}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {o.isFeatured ? (
                      <Badge variant="secondary">Destacada</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-3 py-2">
                    {o.startAt ? new Date(o.startAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2">
                    {o.endAt ? new Date(o.endAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <ViewOfferModal offerId={o.id} />
                      <EditOfferModal
                        offerId={o.id}
                        onSuccess={handleSuccess}
                      />
                      <DeleteOfferDialog
                        offerId={o.id}
                        offerTitle={o.title}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </div>
  );
}
