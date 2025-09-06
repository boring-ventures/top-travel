"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import { SearchInput } from "@/components/admin/cms/search-input";
import { TableShell } from "@/components/admin/cms/table-shell";
import { EmptyState } from "@/components/admin/cms/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NewUserModal,
  EditUserModal,
  ViewUserModal,
  DeleteUserDialog,
} from "@/components/admin/cms/users";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

async function fetchUsers() {
  const res = await fetch(`/api/users`);
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

export default function CmsUsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "users"],
    queryFn: fetchUsers,
  });
  const items = data ?? [];
  const [search, setSearch] = useState("");

  // Modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u: any) =>
      [u.email, u.firstName, u.lastName]
        .filter(Boolean)
        .some((v: string) => (v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const handleView = (user: any) => {
    setSelectedUserId(user.userId);
    setViewModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUserId(user.userId);
    setEditModalOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUserId(user.userId);
    setSelectedUserName(user.email || `${user.firstName} ${user.lastName}`.trim());
    setDeleteDialogOpen(true);
  };

  const handleEditFromView = () => {
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ListHeader
          title="Usuarios"
          description="Gestiona los usuarios del sistema."
          actions={
            <Button
              onClick={() => setNewModalOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          }
        >
          <SearchInput placeholder="Buscar usuarios" onSearch={setSearch} />
        </ListHeader>

        {error ? (
          <div className="text-sm text-red-600">
            Error al cargar los usuarios.
          </div>
        ) : (
          <TableShell
            title="Todos los Usuarios"
            isLoading={isLoading}
            empty={
              filtered.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? "No hay usuarios que coincidan con tu búsqueda"
                      : "No hay usuarios aún"
                  }
                  description={
                    search
                      ? "Intenta con una consulta diferente."
                      : "Crea el primer usuario."
                  }
                  action={
                    <Button
                      onClick={() => setNewModalOpen(true)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nuevo Usuario
                    </Button>
                  }
                />
              ) : null
            }
          >
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Rol</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: any) => (
                  <tr key={u.userId} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-2 font-medium">
                      {u.firstName && u.lastName 
                        ? `${u.firstName} ${u.lastName}`
                        : u.firstName || u.lastName || "Sin nombre"
                      }
                    </td>
                    <td className="px-3 py-2">{u.email || "Sin email"}</td>
                    <td className="px-3 py-2">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {u.role === "SUPERADMIN" ? "Super Admin" : u.role}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={u.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}>
                        {u.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(u)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver usuario</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(u)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar usuario</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(u)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar usuario</TooltipContent>
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
        <NewUserModal open={newModalOpen} onOpenChange={setNewModalOpen} />

        <EditUserModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          userId={selectedUserId}
        />

        <ViewUserModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          userId={selectedUserId}
          onEdit={handleEditFromView}
        />

        <DeleteUserDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          userId={selectedUserId}
          userName={selectedUserName}
        />
      </div>
    </TooltipProvider>
  );
}