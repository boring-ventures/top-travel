"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Edit, Calendar } from "lucide-react";

interface ViewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onEdit: () => void;
}

async function fetchUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export function ViewUserModal({ open, onOpenChange, userId, onEdit }: ViewUserModalProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId && open,
  });

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  INFORMACIÓN PERSONAL
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Nombre completo:</span>
                    <p className="text-sm">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || user.lastName || "Sin nombre"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm">{user.email || "Sin email"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  PERMISOS Y ESTADO
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Rol:</span>
                    <div className="mt-1">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {user.role === "SUPERADMIN" ? "Super Admin" : user.role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Estado:</span>
                    <div className="mt-1">
                      <Badge className={user.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}>
                        {user.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">
                FECHAS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">Creado:</span>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">Actualizado:</span>
                    <p className="text-sm text-muted-foreground">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('es-ES') : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button onClick={onEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editar Usuario
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Usuario no encontrado</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}