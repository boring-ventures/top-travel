"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TravelCardProps = {
  id: string;
  title: string;
  price?: string;
  description: string;
  imageUrl: string;
  href: string;
  amenities?: string[];
  exclusions?: string[];
  location?: string;
};

export default function TravelCard({
  id,
  title,
  price,
  description,
  imageUrl,
  href,
  amenities = [],
  exclusions = [],
  location,
}: TravelCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
      {/* Full Image Background */}
      <div className="relative w-full h-full min-h-[400px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Glass Effect Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top Glass Elements */}
          <div className="flex justify-between items-start">
            {/* Location Badge - Glass Effect */}
            {location && (
              <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              </div>
            )}

            {/* Price Badge - Glass Effect */}
            {price && (
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <span className="text-sm font-bold text-white">{price}</span>
              </div>
            )}
          </div>

          {/* Bottom Glass Content */}
          <div className="space-y-4">
            {/* Title */}
            <h3 className="text-2xl font-bold text-white leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/90 leading-relaxed text-base">
              {description}
            </p>

            {/* Glass Call to Action */}
            <Button
              asChild
              className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30"
            >
              <Link
                href={href}
                className="flex items-center justify-center gap-2"
              >
                <span>Explorar destino</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
