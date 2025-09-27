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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { EditQuinceaneraDestinationModal } from "./edit-quinceanera-destination-modal";
import { DeleteQuinceaneraDestinationDialog } from "./delete-quinceanera-destination-dialog";
import { CreateQuinceaneraDestinationModal } from "./create-quinceanera-destination-modal";

interface QuinceaneraDestination {
  id: string;
  slug: string;
  name: string;
  title: string;
  summary?: string;
  description?: string;
  heroImageUrl?: string;
  gallery?: string[];
  location?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function QuinceaneraDestinationsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<QuinceaneraDestination | null>(null);
  const [deletingDestination, setDeletingDestination] =
    useState<QuinceaneraDestination | null>(null);
  const { toast } = useToast();

  const {
    data: destinations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quinceanera-destinations"],
    queryFn: async () => {
      const response = await api.get("/api/quinceanera-destinations");
      return response.data as QuinceaneraDestination[];
    },
  });

  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (destination: QuinceaneraDestination) => {
    try {
      await api.delete(`/api/quinceanera-destinations/${destination.slug}`);
      toast({
        title: "Destino eliminado",
        description:
          "El destino de quinceañera ha sido eliminado exitosamente.",
      });
      refetch();
      setDeletingDestination(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el destino de quinceañera.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando destinos de quinceañeras...</CardTitle>
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
              Destinos de Quinceañeras ({filteredDestinations.length})
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
                    No se encontraron destinos de quinceañeras
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDestination(destination)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="ml-1">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingDestination(destination)}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateQuinceaneraDestinationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />

      {editingDestination && (
        <EditQuinceaneraDestinationModal
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
        <DeleteQuinceaneraDestinationDialog
          destination={deletingDestination}
          open={!!deletingDestination}
          onOpenChange={(open) => !open && setDeletingDestination(null)}
          onConfirm={() => handleDelete(deletingDestination)}
        />
      )}
    </>
  );
}
