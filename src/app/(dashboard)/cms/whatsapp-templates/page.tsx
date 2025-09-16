"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import {
  NewItemModal,
  EditItemModal,
  ViewItemModal,
  DeleteItemDialog,
} from "@/components/admin/cms/whatsapp-templates";

async function fetchTemplates() {
  const res = await fetch(`/api/whatsapp-templates?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load WhatsApp templates");
  return res.json();
}

export default function CmsWhatsAppTemplatesList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cms", "whatsapp-templates", { page: 1, pageSize: 20 }],
    queryFn: fetchTemplates,
  });
  const items = data?.items ?? [];
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t: any) =>
      [t.name]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      <ListHeader
        title="Plantillas de WhatsApp"
        description="Mensajes predefinidos para compartir vía WhatsApp."
        actions={<NewItemModal onSuccess={handleSuccess} />}
      >
        <SearchInput placeholder="Buscar plantillas" onSearch={setSearch} />
      </ListHeader>
      {error ? (
        <div className="text-sm text-red-600">
          Error al cargar las plantillas.
        </div>
      ) : (
        <TableShell
          title="Todas las Plantillas de WhatsApp"
          isLoading={isLoading}
          empty={
            filtered.length === 0 ? (
              <EmptyState
                title={
                  search
                    ? "No se encontraron plantillas"
                    : "Aún no hay plantillas"
                }
                description={
                  search
                    ? "Intenta con una búsqueda diferente."
                    : "Crea tu primera plantilla."
                }
                action={<NewItemModal onSuccess={handleSuccess} />}
              />
            ) : null
          }
        >
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Tipo de Uso</th>
                <th className="px-3 py-2 text-left">Teléfono</th>
                <th className="px-3 py-2 text-left">Por defecto</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{t.name}</td>
                  <td className="px-3 py-2">
                    {t.usageType ? (
                      <Badge variant="outline">
                        {t.usageType === "OFFERS"
                          ? "Ofertas"
                          : t.usageType === "PACKAGES"
                            ? "Paquetes"
                            : t.usageType === "DESTINATIONS"
                              ? "Destinos"
                              : t.usageType === "EVENTS"
                                ? "Eventos"
                                : t.usageType === "FIXED_DEPARTURES"
                                  ? "Salidas Fijas"
                                  : "General"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No definido</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {t.phoneNumbers && t.phoneNumbers.length > 0 ? (
                      <div className="space-y-1">
                        {t.phoneNumbers.map((phone: string, index: number) => (
                          <div
                            key={index}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {phone}
                          </div>
                        ))}
                        <div className="text-xs text-gray-500">
                          {t.phoneNumbers.length} número
                          {t.phoneNumbers.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    ) : t.phoneNumber ? (
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {t.phoneNumber}
                      </div>
                    ) : (
                      "No definido"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {t.isDefault ? (
                      <Badge variant="secondary">Sí</Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <ViewItemModal
                        templateId={t.id}
                        onSuccess={handleSuccess}
                      />
                      <EditItemModal
                        templateId={t.id}
                        onSuccess={handleSuccess}
                      />
                      <DeleteItemDialog
                        templateId={t.id}
                        templateName={t.name}
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
