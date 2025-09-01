"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TravelCard from "./TravelCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
};

export default function TabbedContent({ tabs, activeTab }: TabbedContentProps) {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id || "");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Don't render if no tabs or no current tab data
  if (!tabs.length || !currentTabData) {
    return null;
  }

  return (
    <section className="py-8">
      <div
        className="container mx-auto"
        style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
      >
        <div className="mb-6">
          <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
            Experiencias de Viaje
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-2 sm:px-4 gap-2 sm:gap-4 md:gap-8 overflow-x-auto scrollbar-hide justify-start sm:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors whitespace-nowrap min-w-fit",
                currentTab === tab.id
                  ? "border-b-primary text-foreground"
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <p
                className={cn(
                  "text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]",
                  currentTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {tab.label}
              </p>
            </button>
          ))}
        </div>

        {/* Tab Content with Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
            onScroll={checkScrollButtons}
          >
            <div className="flex items-stretch p-2 sm:p-4 gap-3 sm:gap-4">
              {currentTabData?.items.map((item) => (
                <div
                  key={item.id}
                  className="w-64 sm:w-72 md:w-80 flex-shrink-0"
                >
                  <TravelCard
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    href={item.href}
                    price={item.price}
                    location={item.location}
                    amenities={item.amenities || []}
                    exclusions={item.exclusions || []}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6">
          <Button asChild variant="outline" size="sm">
            <Link href={currentTabData?.href || "/packages"}>Ver todos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
