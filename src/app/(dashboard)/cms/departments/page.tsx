"use client";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListHeader } from "@/components/admin/cms/list-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye, Heart, Crown, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EditItemModal,
  ViewItemModal,
} from "@/components/admin/cms/departments";
import { useToast } from "@/components/ui/use-toast";

async function fetchDepartments() {
  const res = await fetch(`/api/departments`);
  if (!res.ok) throw new Error("Failed to load departments");
  return res.json();
}

async function ensureDefaultDepartments() {
  const res = await fetch(`/api/departments/ensure-defaults`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to ensure default departments");
  return res.json();
}

export default function CmsDepartmentsList() {
  const { user, profile, isLoading: userLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "departments"],
    queryFn: fetchDepartments,
  });

  const [initializing, setInitializing] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewType, setViewType] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState<string | null>(null);

  const departments = data ?? [];
  const weddingsDept = departments.find((d: any) => d.type === "WEDDINGS");
  const quinceaeneraDept = departments.find(
    (d: any) => d.type === "QUINCEANERA"
  );

  // Auto-initialize departments if they don't exist
  useEffect(() => {
    if (!isLoading && departments.length < 2 && !initializing) {
      handleEnsureDefaults();
    }
  }, [isLoading, departments.length, initializing]);

  const handleEnsureDefaults = async () => {
    setInitializing(true);
    try {
      await ensureDefaultDepartments();
      await queryClient.invalidateQueries({ queryKey: ["cms", "departments"] });
      toast({
        title: "Departamentos inicializados",
        description: "Se han creado los departamentos por defecto.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron inicializar los departamentos.",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
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

  const DepartmentCard = ({
    department,
    type,
    title,
    description,
    icon: Icon,
    color,
  }: {
    department?: any;
    type: string;
    title: string;
    description: string;
    icon: any;
    color: string;
  }) => (
    <Card
      className={`relative overflow-hidden border-2 hover:shadow-lg transition-all duration-200 ${color}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${color === "border-pink-200" ? "bg-pink-100" : "bg-purple-100"}`}
          >
            <Icon
              className={`h-6 w-6 ${color === "border-pink-200" ? "text-pink-600" : "text-purple-600"}`}
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {department && (
            <Badge variant="outline" className="ml-auto">
              Configurado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {department?.heroImageUrl && (
          <div className="w-full h-32 rounded-lg overflow-hidden">
            <img
              src={department.heroImageUrl}
              alt={`${title} hero image`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(type)}
                  disabled={!department}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver contenido del departamento</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleEdit(type)}
                  disabled={!department}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar contenido del departamento</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {!department && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnsureDefaults}
              disabled={initializing}
            >
              {initializing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Inicializar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <ListHeader
          title="Departamentos"
          description="Gestiona el contenido de las páginas de bodas y quinceañeras."
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnsureDefaults}
              disabled={initializing}
            >
              {initializing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Reinicializar Departamentos
            </Button>
          }
        />

        {error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-destructive font-medium">
                  Error al cargar los departamentos
                </p>
                <p className="text-sm text-muted-foreground">
                  Intenta reinicializar los departamentos o contacta al
                  administrador.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnsureDefaults}
                  disabled={initializing}
                >
                  {initializing ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Reinicializar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentCard
              department={weddingsDept}
              type="WEDDINGS"
              title="Bodas de Destino"
              description="Gestiona el contenido de la página de bodas"
              icon={Heart}
              color="border-pink-200"
            />

            <DepartmentCard
              department={quinceaeneraDept}
              type="QUINCEANERA"
              title="Quinceañeras"
              description="Gestiona el contenido de la página de quinceañeras"
              icon={Crown}
              color="border-purple-200"
            />
          </div>
        )}

        {/* Modals */}
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
      </div>
    </TooltipProvider>
  );
}
