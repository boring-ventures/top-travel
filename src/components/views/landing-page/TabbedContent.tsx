"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TravelCard from "./TravelCard";

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
  }>;
};

type TabbedContentProps = {
  tabs: TabItem[];
  activeTab?: string;
};

export default function TabbedContent({ tabs, activeTab }: TabbedContentProps) {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id || "");

  const currentTabData = tabs.find((tab) => tab.id === currentTab);

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
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Paquetes Pre-Diseñados
        </h2>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-2 sm:px-4 gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors whitespace-nowrap",
                currentTab === tab.id
                  ? "border-b-primary text-foreground"
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <p
                className={cn(
                  "text-sm font-bold leading-normal tracking-[0.015em]",
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

        {/* Tab Content */}
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex items-stretch p-2 sm:p-4 gap-3 sm:gap-4">
            {currentTabData?.items.map((item) => (
              <div key={item.id} className="w-72 sm:w-80 flex-shrink-0">
                <TravelCard
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  href={item.href}
                  price={item.price}
                  location={item.location}
                  amenities={["Vista", "Estacionamiento", "Wi-Fi"]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
