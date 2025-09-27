"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Trophy, Sparkles, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventsTabsProps {
  events: {
    music: any[];
    sports: any[];
    special: any[];
    all: any[];
  };
  onCategoryChange: (category: string) => void;
}

const categories = [
  {
    id: "all",
    label: "Todos",
    icon: Grid3X3,
    count: 0, // Will be set dynamically
  },
  {
    id: "music",
    label: "Música",
    icon: Music,
    count: 0, // Will be set dynamically
  },
  {
    id: "sports",
    label: "Deportes",
    icon: Trophy,
    count: 0, // Will be set dynamically
  },
  {
    id: "special",
    label: "Especiales",
    icon: Sparkles,
    count: 0, // Will be set dynamically
  },
];

export function EventsTabs({ events, onCategoryChange }: EventsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  // Update counts
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    count: events[category.id as keyof typeof events]?.length || 0,
  }));

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (
      categoryParam &&
      ["all", "music", "sports", "special"].includes(categoryParam)
    ) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("all");
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/events${newUrl}`, { scroll: false });

    // Notify parent component
    onCategoryChange(categoryId);
  };

  return (
    <div className="w-full">
      {/* Tab Navigation with Glassmorphism Design */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/80 backdrop-blur-sm border border-black/20 rounded-2xl p-2 shadow-lg">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {categoriesWithCounts.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium flex items-center whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "bg-black text-white shadow-lg"
                      : "hover:bg-black/10 text-black"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="text-sm sm:text-base">{category.label}</span>
                  <span className="ml-2 text-xs bg-white/20 text-current px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
