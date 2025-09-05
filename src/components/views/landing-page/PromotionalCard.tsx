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
    <div className="relative flex flex-col rounded-2xl overflow-hidden h-full group">
      {/* Image Section with Glass Effect */}
      <div className="relative aspect-[4/4] overflow-hidden">
        <Image src={imageUrl} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Top Glass Elements */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          {/* Location and Resort - Glass Effect */}
          <div className="text-white">
            {location && resortName && (
              <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{location}</span>
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span>{resortName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Close button - Glass Effect */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-black/20 backdrop-blur-md hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          )}
        </div>

        {/* Bottom Glass Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white leading-tight">
              {title}
            </h3>
            <p className="text-white/90 leading-relaxed text-base">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Glass Call to Action Button */}
      <div className="p-6 mt-auto">
        <Button
          asChild
          className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30"
        >
          <Link href={href} className="flex items-center justify-center gap-2">
            <span>Reservar ahora</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
