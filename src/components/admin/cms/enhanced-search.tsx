"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Filter, X, ChevronDown } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface SearchFilters {
  search: string;
  status: string;
  featured: string;
  dateFilter: string;
}

interface EnhancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export const EnhancedSearch = ({
  onFiltersChange,
  placeholder = "Buscar...",
  className,
}: EnhancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    status: "all",
    featured: "all",
    dateFilter: "all",
  });

  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    onFiltersChange({
      ...filters,
      search: debouncedSearch,
    });
  }, [
    debouncedSearch,
    filters.status,
    filters.featured,
    filters.dateFilter,
    onFiltersChange,
  ]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      featured: "all",
      dateFilter: "all",
    });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.featured !== "all" ||
    filters.dateFilter !== "all" ||
    filters.search !== "";

  const activeFiltersCount = [
    filters.status !== "all",
    filters.featured !== "all",
    filters.dateFilter !== "all",
    filters.search !== "",
  ].filter(Boolean).length;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>

        {/* Mobile: Show filters in popover */}
        {isMobile && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filtros</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="DRAFT">Borrador</SelectItem>
                      <SelectItem value="PUBLISHED">Publicado</SelectItem>
                      <SelectItem value="ARCHIVED">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destacado</label>
                  <Select
                    value={filters.featured}
                    onValueChange={(value) =>
                      handleFilterChange("featured", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar destacado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Solo destacados</SelectItem>
                      <SelectItem value="false">No destacados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtro de fecha</label>
                  <Select
                    value={filters.dateFilter}
                    onValueChange={(value) =>
                      handleFilterChange("dateFilter", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar filtro de fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las fechas</SelectItem>
                      <SelectItem value="active">Activas ahora</SelectItem>
                      <SelectItem value="upcoming">Próximas</SelectItem>
                      <SelectItem value="expired">Expiradas</SelectItem>
                      <SelectItem value="no-date">Sin fecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Desktop: Show filters inline */}
      {!isMobile && (
        <div className="p-4 bg-muted/30 rounded-lg border w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-sm">Filtros</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-1 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Status Filter */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Featured Filter */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Destacado</label>
              <Select
                value={filters.featured}
                onValueChange={(value) => handleFilterChange("featured", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar destacado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Solo destacados</SelectItem>
                  <SelectItem value="false">No destacados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Filtro de fecha</label>
              <Select
                value={filters.dateFilter}
                onValueChange={(value) =>
                  handleFilterChange("dateFilter", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar filtro de fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="active">Activas ahora</SelectItem>
                  <SelectItem value="upcoming">Próximas</SelectItem>
                  <SelectItem value="expired">Expiradas</SelectItem>
                  <SelectItem value="no-date">Sin fecha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Búsqueda: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("search", "")}
                className="h-auto p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Estado:{" "}
              {filters.status === "DRAFT"
                ? "Borrador"
                : filters.status === "PUBLISHED"
                  ? "Publicado"
                  : "Archivado"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("status", "all")}
                className="h-auto p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.featured !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Destacado: {filters.featured === "true" ? "Sí" : "No"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("featured", "all")}
                className="h-auto p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.dateFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Fecha:{" "}
              {filters.dateFilter === "active"
                ? "Activas"
                : filters.dateFilter === "upcoming"
                  ? "Próximas"
                  : filters.dateFilter === "expired"
                    ? "Expiradas"
                    : "Sin fecha"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("dateFilter", "all")}
                className="h-auto p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
