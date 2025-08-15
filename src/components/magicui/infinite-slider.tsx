"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
  speed?: number; // seconds for a full loop (lower = faster)
  speedOnHover?: number; // seconds for a full loop when hovering
};

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
  }, []);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [measure]);

  return { ref, size } as const;
}

export function InfiniteSlider({
  children,
  gap = 16,
  direction = "horizontal",
  reverse = false,
  className,
  speed = 40,
  speedOnHover,
}: InfiniteSliderProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);

  const contentSize = useMemo(() => {
    return (direction === "horizontal" ? size.width : size.height) + gap;
  }, [size.height, size.width, gap, direction]);

  const duration = useMemo(
    () => (hovered && speedOnHover ? speedOnHover : speed),
    [hovered, speedOnHover, speed]
  );

  useEffect(() => {
    if (!contentSize) return;
    let controls: ReturnType<typeof animate> | undefined;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: duration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => setIsTransitioning(false),
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }
    return () => controls?.stop();
  }, [contentSize, reverse, translation, isTransitioning, duration]);

  useEffect(() => {
    if (!contentSize) return;
    setIsTransitioning(true);
  }, [duration, contentSize]);

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default InfiniteSlider;

