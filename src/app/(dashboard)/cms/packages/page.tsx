"use client";
import { useMemo, useState } from "react";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
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
  NewPackageModal,
  EditPackageModal,
  ViewPackageModal,
  DeletePackageDialog,
} from "@/components/admin/cms/packages";
import { Plus, FileText, ExternalLink, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function fetchPackages(isTop?: boolean | null | undefined) {
  const params = new URLSearchParams({
    page: "1",
    pageSize: "20",
  });

  if (typeof isTop === "boolean") {
    params.append("isTop", isTop.toString());
  }

  const res = await fetch(`/api/packages?${params.toString()}`);
  if (!res.ok) throw new Error("Error al cargar los paquetes");
  return res.json();
}

export default function CmsPackagesList() {
  const [search, setSearch] = useState("");
  const [isTopFilter, setIsTopFilter] = useState<boolean | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "cms",
      "packages",
      { page: 1, pageSize: 20, isTop: isTopFilter },
    ],
    queryFn: () => fetchPackages(isTopFilter ?? undefined),
  });
  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p: any) =>
      [p.title, p.slug, p.currency]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const handleSuccess = () => {
    refetch();
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Paquetes"
          description="Crear y gestionar paquetes de viaje."
          actions={<NewPackageModal onSuccess={handleSuccess} />}
        >
          <div className="flex gap-2">
            <SearchInput placeholder="Buscar paquetes" onSearch={setSearch} />
            <Select
              value={isTopFilter === null ? "all" : isTopFilter.toString()}
              onValueChange={(value) => {
                if (value === "all") {
                  setIsTopFilter(null);
                } else {
                  setIsTopFilter(value === "true");
                }
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por Top" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Solo Top</SelectItem>
                <SelectItem value="false">No Top</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar los paquetes.
          </div>
        ) : (
          <TableShell
            title="Todos los Paquetes"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No se encontraron paquetes"
                      : "Aún no hay paquetes"
                  }
                  description={
                    search
                      ? "Intenta con otra búsqueda."
                      : "Crea tu primer paquete."
                  }
                  action={<NewPackageModal onSuccess={handleSuccess} />}
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">Título</th>
                  <th className="px-3 py-2 text-left">Slug</th>
                  <th className="px-3 py-2 text-left">Duración</th>
                  <th className="px-3 py-2 text-left">Precio</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Top</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-center">PDF</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <span className="font-medium">{p.title}</span>
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {p.slug || "—"}
                      </code>
                    </td>
                    <td className="px-3 py-2">
                      {p.durationDays ? (
                        <span className="text-sm">
                          {p.durationDays} día{p.durationDays !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {p.fromPrice ? (
                        <span className="text-sm font-medium">
                          {formatPriceWithCurrency(
                            p.fromPrice,
                            p.currency,
                            false
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {p.isCustom ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Personalizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Estándar
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {p.isTop ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Star className="h-3 w-3" />
                          Top
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      {p.pdfUrl ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(p.pdfUrl, "_blank")}
                              className="h-6 w-6 p-0"
                            >
                              <FileText className="h-3 w-3 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver documento PDF</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <ViewPackageModal packageSlug={p.slug} />
                        <EditPackageModal
                          packageSlug={p.slug}
                          onSuccess={handleSuccess}
                        />
                        <DeletePackageDialog
                          packageSlug={p.slug}
                          packageTitle={p.title}
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

        {/* Modals */}
        <NewPackageModal onSuccess={handleSuccess} />
      </div>
    </TooltipProvider>
  );
}
