"use client";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NewItemModal,
  EditItemModal,
  ViewItemModal,
  DeleteItemDialog,
} from "@/components/admin/cms/departments";

async function fetchDepartments() {
  const res = await fetch(`/api/departments`);
  if (!res.ok) throw new Error("Failed to load departments");
  return res.json();
}

export default function CmsDepartmentsList() {
  const { user, profile, isLoading: userLoading } = useCurrentUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "departments"],
    queryFn: fetchDepartments,
  });
  const items = data ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewType, setViewType] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = items.filter((d: any) =>
      typeFilter === "ALL" ? true : d.type === typeFilter
    );
    if (!q) return base;
    return base.filter((d: any) =>
      [d.type, d.title]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search, typeFilter]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "WEDDINGS":
        return "Bodas";
      case "QUINCEANERA":
        return "Quinceañera";
      default:
        return type;
    }
  };

  const handleView = (type: string) => {
    setViewType(type);
    setViewOpen(true);
  };

  const handleEdit = (type: string) => {
    setEditType(type);
    setEditOpen(true);
  };

  const handleDelete = (type: string, title: string) => {
    setDeleteType(type);
    setDeleteTitle(title);
    setDeleteOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Departamentos"
          description="Departamentos del sitio web y contenido de aterrizaje."
          actions={
            <div className="flex gap-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>Role: {profile?.role || "Loading..."}</span>
                <span>User: {user?.email || "Loading..."}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/test-auth", {
                      method: "GET",
                    });
                    if (res.ok) {
                      const data = await res.json();
                      console.log("Test auth info:", data);
                      alert(
                        `Test auth: Authenticated: ${data.authenticated}, Role: ${data.role}, Email: ${data.email}`
                      );
                    } else {
                      alert("Failed to get test auth info");
                    }
                  } catch (error) {
                    alert("Error getting test auth info");
                  }
                }}
              >
                Test Auth
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/debug-auth", {
                      method: "GET",
                    });
                    if (res.ok) {
                      const data = await res.json();
                      console.log("Debug info:", data);
                      alert(
                        `Debug info logged to console. User: ${data.user.email}, Role: ${data.profile?.role}`
                      );
                    } else {
                      alert("Failed to get debug info");
                    }
                  } catch (error) {
                    alert("Error getting debug info");
                  }
                }}
              >
                Debug Auth
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/debug-auth", {
                      method: "POST",
                    });
                    if (res.ok) {
                      alert(
                        "Role updated to SUPERADMIN! Please refresh the page."
                      );
                      window.location.reload();
                    } else {
                      alert("Failed to update role");
                    }
                  } catch (error) {
                    alert("Error updating role");
                  }
                }}
              >
                Make SUPERADMIN
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/check-role", {
                      method: "GET",
                    });
                    if (res.ok) {
                      const data = await res.json();
                      console.log("Role check:", data);
                      alert(
                        `Role Check:\nDirect DB Role: ${data.directQuery.role}\nAuth Function Role: ${data.authFunction.role}\nRoles Match: ${data.rolesMatch}`
                      );
                    } else {
                      alert("Failed to check role");
                    }
                  } catch (error) {
                    alert("Error checking role");
                  }
                }}
              >
                Check Role
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/fix-role", {
                      method: "POST",
                    });
                    if (res.ok) {
                      const data = await res.json();
                      console.log("Fix role result:", data);
                      alert(
                        `Fix Role Result:\nBefore: ${data.beforeUpdate.role}\nAfter: ${data.afterUpdate.role}\nAll Match: ${data.allMatch}\n\nPlease refresh the page.`
                      );
                      window.location.reload();
                    } else {
                      alert("Failed to fix role");
                    }
                  } catch (error) {
                    alert("Error fixing role");
                  }
                }}
              >
                Fix Role
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/db-check", {
                      method: "GET",
                    });
                    if (res.ok) {
                      const data = await res.json();
                      console.log("DB check:", data);
                      alert(
                        `DB Check:\nProfile Count: ${data.profileCount}\nCurrent User Exists: ${data.currentUserExists}\nCurrent User Role: ${data.currentUserProfile?.role || "NOT_FOUND"}`
                      );
                    } else {
                      alert("Failed to check database");
                    }
                  } catch (error) {
                    alert("Error checking database");
                  }
                }}
              >
                DB Check
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/test-offer-update", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        offerId: "cmed08x0u000rczigxquxgd5z",
                        updateData: { title: "Test Update" },
                      }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      console.log("Test offer update result:", data);
                      alert(
                        `Test Offer Update:\nSuccess: ${data.success}\nUser Role: ${data.userRole}`
                      );
                    } else {
                      const errorData = await res.json();
                      alert(
                        `Test Offer Update Failed:\nStatus: ${res.status}\nError: ${errorData.error}\nUser Role: ${errorData.userRole}`
                      );
                    }
                  } catch (error) {
                    alert("Error testing offer update");
                  }
                }}
              >
                Test Offer Update
              </Button>
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Departamento
              </Button>
            </div>
          }
        >
          <div className="flex w-full items-center justify-between gap-2">
            <SearchInput
              placeholder="Buscar departamentos..."
              onSearch={setSearch}
            />
            <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
              <TabsList>
                <TabsTrigger value="ALL">Todos</TabsTrigger>
                <TabsTrigger value="WEDDINGS">Bodas</TabsTrigger>
                <TabsTrigger value="QUINCEANERA">Quinceañera</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </ListHeader>
        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar los departamentos.
          </div>
        ) : (
          <TableShell
            title="Todos los Departamentos"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No se encontraron departamentos"
                      : "No hay departamentos aún"
                  }
                  description={
                    search
                      ? "Intenta con una búsqueda diferente."
                      : "Crea tu primer departamento."
                  }
                  action={
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Departamento
                    </Button>
                  }
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Título</th>
                  <th className="px-3 py-2 text-left">Imagen Principal</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d: any) => (
                  <tr key={d.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <Badge variant="secondary">{getTypeLabel(d.type)}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-medium">{d.title}</span>
                    </td>
                    <td className="px-3 py-2">
                      {d.heroImageUrl ? (
                        <img
                          src={d.heroImageUrl}
                          alt="Imagen principal"
                          className="h-8 w-14 rounded object-cover ring-1 ring-border"
                        />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(d.type)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver departamento</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(d.type)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar departamento</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(d.type, d.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar departamento</p>
                          </TooltipContent>
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
        <NewItemModal open={createOpen} onOpenChange={setCreateOpen} />

        <ViewItemModal
          open={viewOpen}
          onOpenChange={setViewOpen}
          departmentType={viewType}
        />

        <EditItemModal
          open={editOpen}
          onOpenChange={setEditOpen}
          departmentType={editType}
        />

        <DeleteItemDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          departmentType={deleteType}
          departmentTitle={deleteTitle}
        />
      </div>
    </TooltipProvider>
  );
}
