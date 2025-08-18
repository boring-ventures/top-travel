"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromotionalCardProps = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  href: string;
  location?: string;
  resortName?: string;
  onClose?: () => void;
};

export default function PromotionalCard({
  id,
  title,
  subtitle,
  description,
  imageUrl,
  href,
  location,
  resortName,
  onClose,
}: PromotionalCardProps) {
  return (
    <div className="relative flex flex-col bg-card rounded-lg shadow-lg overflow-hidden h-full">
      {/* Image Section with Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={imageUrl} alt={title} fill className="object-cover" />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Top content overlay */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex justify-between items-start">
          {/* Location and Resort */}
          <div className="text-white">
            {location && resortName && (
              <div className="flex items-center gap-1 text-xs sm:text-sm font-medium">
                <span>{location}</span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span>{resortName}</span>
              </div>
            )}
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-5 h-5 sm:w-6 sm:h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
            </button>
          )}
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="p-3 sm:p-4 mt-auto">
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          <Link href={href} className="flex items-center justify-center gap-2">
            <span>Reservar ahora</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
