"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface GridMotionProps {
  /**
   * Array of items to display in the grid
   */
  items?: (string | ReactNode)[];
  /**
   * Color for the radial gradient background
   */
  gradientColor?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function GridMotion({
  items = [],
  gradientColor = "black",
  className,
}: GridMotionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mouseX, setMouseX] = useState(0);

  const totalItems = 28;
  const defaultItems = Array.from(
    { length: totalItems },
    (_, index) => `Item ${index + 1}`
  );
  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={cn("h-full w-full overflow-hidden", className)}
      ref={gridRef}
    >
      <section
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="relative z-2 flex-none grid h-[150vh] w-[150vw] gap-4 grid-rows-[repeat(4,1fr)] grid-cols-[100%] -rotate-15 origin-center">
          {[...Array(4)].map((_, rowIndex) => {
            const direction = rowIndex % 2 === 0 ? 1 : -1;
            const moveAmount =
              ((mouseX / window.innerWidth) * 300 - 150) * direction;

            return (
              <div
                key={rowIndex}
                className="grid gap-4 grid-cols-[repeat(7,1fr)] will-change-transform transition-transform duration-700 ease-out"
                ref={(el) => (rowRefs.current[rowIndex] = el)}
                style={{
                  transform: `translateX(${moveAmount}px)`,
                }}
              >
                {[...Array(7)].map((_, itemIndex) => {
                  const content = combinedItems[rowIndex * 7 + itemIndex];
                  return (
                    <div key={itemIndex} className="relative">
                      <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-foreground text-xl">
                        {typeof content === "string" &&
                        content.startsWith("http") ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${content})`,
                            }}
                          />
                        ) : (
                          <div className="p-4 text-center z-1">{content}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="relative pointer-events-none h-full w-full inset-0">
          <div className="rounded-none" />
        </div>
      </section>
    </div>
  );
}
