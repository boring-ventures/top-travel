"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Calendar,
  Plane,
  Tag,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isValidImageUrl } from "@/lib/utils";

interface SearchResult {
  type: "package" | "destination" | "event" | "fixed-departure";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
  destinations?: any[];
  tags?: any[];
  startDate?: string;
  endDate?: string;
  destination?: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  isVisible: boolean;
  onResultClick: () => void;
}

const getTypeIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "package":
      return <Package className="h-4 w-4" />;
    case "destination":
      return <MapPin className="h-4 w-4" />;
    case "event":
      return <Calendar className="h-4 w-4" />;
    case "fixed-departure":
      return <Plane className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: SearchResult["type"]) => {
  switch (type) {
    case "package":
      return "Paquete";
    case "destination":
      return "Destino";
    case "event":
      return "Evento";
    case "fixed-departure":
      return "Salida Fija";
    default:
      return "Resultado";
  }
};

const formatPrice = (price?: number, currency?: string) => {
  if (!price) return null;
  return `${currency || "$"}${price.toLocaleString()}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function SearchResults({
  results,
  isLoading,
  isVisible,
  onResultClick,
}: SearchResultsProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          Buscando...
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No se encontraron resultados
        </div>
      ) : (
        <div className="py-2">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.url}
              onClick={onResultClick}
              className="block px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                {/* Image */}
                {result.image && isValidImageUrl(result.image) ? (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {getTypeIcon(result.type)}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {getTypeLabel(result.type)}
                    </Badge>
                    {result.price && (
                      <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {formatPrice(result.price, result.currency)}
                      </div>
                    )}
                  </div>

                  <h4 className="font-medium text-foreground truncate">
                    {result.title}
                  </h4>

                  {result.subtitle && (
                    <p className="text-sm text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  )}

                  {/* Additional info */}
                  <div className="flex items-center gap-2 mt-1">
                    {result.startDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(result.startDate)}
                      </div>
                    )}

                    {result.destinations && result.destinations.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {result.destinations.map((d) => d.city).join(", ")}
                      </div>
                    )}

                    {result.tags && result.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        {result.tags
                          .slice(0, 2)
                          .map((t) => t.name)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
