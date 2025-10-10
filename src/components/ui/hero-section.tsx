import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { HeroImage } from "@/components/ui/hero-image";
import { FeaturedBadge } from "@/components/ui/featured-badge";
import { LocationDisplay } from "@/components/ui/location-display";
import { DateRange } from "@/components/ui/date-time-display";
import { DurationDisplay } from "@/components/ui/date-time-display";
import { PriceDisplay } from "@/components/ui/price-display";
import { TagsSection } from "@/components/ui/tags-section";
import { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  heroImageUrl?: string;
  fallbackGradient?: string;
  backButton: {
    href: string;
    label: string;
  };
  badges: Array<{
    label: string;
    variant?: "default" | "secondary";
    className?: string;
    icon?: LucideIcon;
  }>;
  isFeatured?: boolean;
  location?: {
    city?: string;
    country?: string;
    venue?: string;
  };
  dates?: {
    startDate: Date;
    endDate: Date;
  };
  price?: {
    amount?: number;
    currency?: string;
    isCustom?: boolean;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  heroImageUrl,
  fallbackGradient = "bg-gradient-to-br from-gray-600 to-gray-800",
  backButton,
  badges,
  isFeatured,
  location,
  dates,
  price,
  tags,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={`relative h-[60vh] min-h-[400px] w-full overflow-hidden ${className || ""}`}
    >
      <HeroImage
        src={heroImageUrl}
        alt={title}
        fallbackGradient={fallbackGradient}
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-transparent" />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <BackButton href={backButton.href} label={backButton.label} />
      </div>

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Badge
                  key={index}
                  variant={badge.variant || "secondary"}
                  className={badge.className}
                >
                  {Icon && <Icon className="h-3 w-3 mr-1" />}
                  {badge.label}
                </Badge>
              );
            })}
            {isFeatured && <FeaturedBadge />}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h1>

          {subtitle && (
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-muted-foreground">
              {subtitle}
            </h2>
          )}

          {description && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-6">
              {description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-muted-foreground mb-6">
            {location && (
              <LocationDisplay
                city={location.city}
                country={location.country}
                venue={location.venue}
              />
            )}
            {dates && (
              <DateRange startDate={dates.startDate} endDate={dates.endDate} />
            )}
            {dates && (
              <DurationDisplay
                startDate={dates.startDate}
                endDate={dates.endDate}
              />
            )}
          </div>

          {/* Price */}
          {price && (
            <div className="mb-6">
              <PriceDisplay
                price={price.amount}
                currency={price.currency}
                isCustom={price.isCustom}
                className="bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg inline-block"
              />
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <TagsSection
              title=""
              tags={tags}
              variant="rounded"
              className="mb-0"
            />
          )}
        </div>
      </div>
    </section>
  );
}
