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
  const [isClient, setIsClient] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Responsive grid configuration
  const getGridConfig = () => {
    if (screenSize.width < 640) {
      // Mobile: 3 columns, 6 rows
      return { cols: 3, rows: 6, totalItems: 18 };
    } else if (screenSize.width < 1024) {
      // Tablet: 5 columns, 5 rows
      return { cols: 5, rows: 5, totalItems: 25 };
    } else {
      // Desktop: 7 columns, 4 rows
      return { cols: 7, rows: 4, totalItems: 28 };
    }
  };

  const gridConfig = getGridConfig();
  const { cols, rows, totalItems } = gridConfig;

  const defaultItems = Array.from(
    { length: totalItems },
    (_, index) => `Item ${index + 1}`
  );
  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouseX(e.touches[0].clientX);
      }
    };

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const detectTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Set initial screen size and touch detection
    handleResize();
    detectTouchDevice();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
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
        <div 
          className="relative z-2 flex-none grid gap-2 sm:gap-3 lg:gap-4 grid-rows-[repeat(var(--rows),1fr)] grid-cols-[100%] -rotate-12 sm:-rotate-15 origin-center"
          style={{
            '--rows': rows,
            height: screenSize.width < 640 ? '120vh' : screenSize.width < 1024 ? '140vh' : '150vh',
            width: screenSize.width < 640 ? '120vw' : screenSize.width < 1024 ? '140vw' : '150vw',
          } as React.CSSProperties}
        >
          {[...Array(rows)].map((_, rowIndex) => {
            const direction = rowIndex % 2 === 0 ? 1 : -1;
            
            // Reduce movement effect on mobile and touch devices
            const movementMultiplier = isTouchDevice ? 0.3 : 1;
            const maxMovement = screenSize.width < 640 ? 50 : screenSize.width < 1024 ? 100 : 150;
            const centerOffset = maxMovement / 2;
            
            const moveAmount = isClient
              ? ((mouseX / window.innerWidth) * maxMovement - centerOffset) * direction * movementMultiplier
              : 0;

            return (
              <div
                key={rowIndex}
                className="grid gap-2 sm:gap-3 lg:gap-4 will-change-transform transition-transform duration-700 ease-out"
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  transform: `translateX(${moveAmount}px)`,
                }}
                ref={(el) => {
                  rowRefs.current[rowIndex] = el;
                }}
              >
                {[...Array(cols)].map((_, itemIndex) => {
                  const content = combinedItems[rowIndex * cols + itemIndex];
                  return (
                    <div key={itemIndex} className="relative">
                      <div className="relative h-full w-full overflow-hidden rounded-md sm:rounded-lg bg-muted flex items-center justify-center text-foreground text-sm sm:text-lg lg:text-xl">
                        {typeof content === "string" &&
                        (content.startsWith("http") ||
                          content.startsWith("/images/")) ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${content})`,
                            }}
                          />
                        ) : (
                          <div className="p-2 sm:p-3 lg:p-4 text-center z-1">{content}</div>
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
