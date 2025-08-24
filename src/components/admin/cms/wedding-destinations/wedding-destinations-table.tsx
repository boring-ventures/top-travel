"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { EditWeddingDestinationModal } from "./edit-wedding-destination-modal";
import { DeleteWeddingDestinationDialog } from "./delete-wedding-destination-dialog";
import { CreateWeddingDestinationModal } from "./create-wedding-destination-modal";

interface WeddingDestination {
  id: string;
  slug: string;
  name: string;
  title: string;
  description?: string;
  heroImageUrl?: string;
  gallery?: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function WeddingDestinationsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<WeddingDestination | null>(null);
  const [deletingDestination, setDeletingDestination] =
    useState<WeddingDestination | null>(null);
  const { toast } = useToast();

  const {
    data: destinations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wedding-destinations"],
    queryFn: async () => {
      const response = await api.get("/api/wedding-destinations");
      return response.data as WeddingDestination[];
    },
  });

  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (destination: WeddingDestination) => {
    try {
      await api.delete(`/api/wedding-destinations/${destination.slug}`);
      toast({
        title: "Destino eliminado",
        description: "El destino de boda ha sido eliminado exitosamente.",
      });
      refetch();
      setDeletingDestination(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el destino de boda.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando destinos de bodas...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Destinos de Bodas ({filteredDestinations.length})
            </CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Destino
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar destinos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead>Galería</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDestinations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No se encontraron destinos de bodas
                  </TableCell>
                </TableRow>
              ) : (
                filteredDestinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell className="font-medium">
                      {destination.name}
                    </TableCell>
                    <TableCell>{destination.title}</TableCell>
                    <TableCell>
                      {destination.isFeatured ? (
                        <Badge variant="default">Destacado</Badge>
                      ) : (
                        <Badge variant="secondary">Normal</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {destination.heroImageUrl ? (
                        <div className="w-12 h-8 bg-muted rounded overflow-hidden">
                          <img
                            src={destination.heroImageUrl}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Sin imagen
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {destination.gallery && destination.gallery.length > 0 ? (
                        <Badge variant="outline">
                          {destination.gallery.length} imágenes
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Sin galería
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(destination.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingDestination(destination)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingDestination(destination)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateWeddingDestinationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />

      {editingDestination && (
        <EditWeddingDestinationModal
          destination={editingDestination}
          open={!!editingDestination}
          onOpenChange={(open) => !open && setEditingDestination(null)}
          onSuccess={() => {
            setEditingDestination(null);
            refetch();
          }}
        />
      )}

      {deletingDestination && (
        <DeleteWeddingDestinationDialog
          destination={deletingDestination}
          open={!!deletingDestination}
          onOpenChange={(open) => !open && setDeletingDestination(null)}
          onConfirm={() => handleDelete(deletingDestination)}
        />
      )}
    </>
  );
}
