import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, Plane } from "lucide-react";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface RelatedItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  heroImageUrl?: string;
  fromPrice?: number;
  currency?: string;
  isCustom?: boolean;
  isFeatured?: boolean;
  destinations?: Array<{ city: string; country: string }>;
  startDate?: Date;
  endDate?: Date;
  type: "package" | "destination" | "fixed-departure";
}

interface RelatedItemsGridProps {
  title: string;
  items: RelatedItem[];
  maxItems?: number;
  showViewAllButton?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function RelatedItemsGrid({
  title,
  items,
  maxItems = 6,
  showViewAllButton = true,
  viewAllHref,
  className,
}: RelatedItemsGridProps) {
  const displayItems = items.slice(0, maxItems);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "package":
        return Package;
      case "destination":
        return MapPin;
      case "fixed-departure":
        return Plane;
      default:
        return Package;
    }
  };

  const getTypeBadge = (type: string, isCustom?: boolean) => {
    switch (type) {
      case "package":
        return (
          <Badge
            variant={isCustom ? "default" : "secondary"}
            className="text-xs"
          >
            {isCustom ? "Personalizado" : "Predefinido"}
          </Badge>
        );
      case "destination":
        return null;
      case "fixed-departure":
        return (
          <Badge variant="secondary" className="text-xs">
            Salida Fija
          </Badge>
        );
      default:
        return null;
    }
  };

  const getFallbackGradient = (type: string) => {
    switch (type) {
      case "package":
        return "bg-gradient-to-br from-green-100 to-teal-100";
      case "destination":
        return "bg-gradient-to-br from-blue-100 to-indigo-100";
      case "fixed-departure":
        return "bg-gradient-to-br from-purple-100 to-pink-100";
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200";
    }
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        {showViewAllButton && viewAllHref && (
          <Button asChild variant="outline">
            <Link href={viewAllHref}>Ver todos</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item) => {
          const Icon = getTypeIcon(item.type);
          const fallbackGradient = getFallbackGradient(item.type);

          return (
            <Card
              key={item.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Link
                href={`/${item.type === "fixed-departure" ? "fixed-departures" : item.type}s/${item.slug}`}
                className="block"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {item.heroImageUrl ? (
                    <Image
                      src={item.heroImageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`h-full w-full ${fallbackGradient} flex items-center justify-center`}
                    >
                      <Icon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    {getTypeBadge(item.type, item.isCustom)}
                  </div>
                  {item.fromPrice && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-black hover:bg-white text-xs">
                        Desde{" "}
                        {formatPriceWithCurrency(
                          item.fromPrice,
                          item.currency,
                          false
                        )}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  {item.summary && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.summary}
                    </p>
                  )}

                  {/* Destinations or Dates */}
                  {item.destinations && item.destinations.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {item.destinations
                          .slice(0, 2)
                          .map((d) => d.city)
                          .join(", ")}
                        {item.destinations.length > 2 &&
                          ` +${item.destinations.length - 2} más`}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="px-4 pb-4">
                <WhatsAppCTA
                  variant="outline"
                  size="sm"
                  label="Consultar"
                  template="Hola! Me interesa {title}."
                  variables={{ title: item.title }}
                  campaign={`${item.type}_detail`}
                  content={item.slug}
                  className="w-full"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
