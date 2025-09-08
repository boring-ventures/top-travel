"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TravelCard from "./TravelCard";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Music,
  MapPin,
  Calendar,
  Globe,
  Mic,
  Sparkles,
  Trophy,
  Palette,
  Package,
  Wrench,
  Mountain,
  Crown,
} from "lucide-react";

type TabItem = {
  id: string;
  label: string;
  href: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    href: string;
    price?: string;
    location?: string;
    amenities?: string[];
    exclusions?: string[];
  }>;
};

type TabbedContentProps = {
  tabs: TabItem[];
  activeTab?: string;
  showViewAllButton?: boolean;
};

export default function TabbedContent({
  tabs,
  activeTab,
  showViewAllButton = true,
}: TabbedContentProps) {
  const [currentTab, setCurrentTab] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Función para obtener el icono apropiado para cada tab
  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case "events":
        return Music;
      case "destinations":
        return MapPin;
      case "fixed-departures":
        return Calendar;
      case "south-america":
        return Globe;
      // Iconos específicos para eventos
      case "concerts":
        return Mic;
      case "festivals":
        return Sparkles;
      case "cultural":
        return Palette;
      case "sports":
        return Trophy;
      // Iconos específicos para paquetes
      case "packages":
        return Package;
      case "custom":
        return Wrench;
      case "adventure":
        return Mountain;
      case "luxury":
        return Crown;
      default:
        return Package;
    }
  };

  // Set initial tab after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
    setCurrentTab(activeTab || tabs[0]?.id || "");
  }, [activeTab, tabs]);

  const currentTabData = tabs.find((tab) => tab.id === currentTab);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons);
      return () =>
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
    }
  }, [currentTab]);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Don't render if no tabs or no current tab data
  if (!tabs.length || !currentTabData) {
    return null;
  }

  return (
    <div className="text-center">
      {/* Tab Navigation - Centered */}
      <div className="flex justify-center items-start mb-12">
        {/* Filter Tabs with Glassmorphism Design */}
        <div className="bg-white/80 backdrop-blur-sm border border-black/20 rounded-2xl p-2 shadow-lg">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = getTabIcon(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium flex items-center ${
                    currentTab === tab.id
                      ? "bg-black text-white shadow-lg"
                      : "hover:bg-black/10 text-black"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content - Centered Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {currentTabData?.items.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl group"
          >
            <div className="relative h-80 sm:h-96">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Top Glass Content */}
              <div className="absolute top-0 left-0 right-0 p-6">
                <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-block">
                  <p className="text-white text-sm font-medium">
                    {item.location}
                  </p>
                </div>
              </div>

              {/* Bottom Glass Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="space-y-4">
                  <h2 className="text-white text-2xl font-bold font-serif drop-shadow-lg">
                    {item.title}
                  </h2>

                  <p className="text-white text-lg font-normal drop-shadow-lg">
                    {item.price || "Consultar precio"}
                  </p>

                  <Button
                    asChild
                    className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
                  >
                    <Link href={item.href}>
                      <span>Conoce más</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button - Centered below content */}
      {showViewAllButton && (
        <div className="mt-12 text-center">
          <Link
            className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/80 transition-colors duration-300 inline-flex items-center gap-2 text-lg font-semibold"
            href={currentTabData?.href || "/packages"}
          >
            Ver Todos
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
