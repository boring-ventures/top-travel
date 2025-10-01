import React from "react";
import { cn } from "@/lib/utils";

interface TextLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?:
    | "light"
    | "dark"
    | "pink"
    | "white"
    | "wine"
    | "yellow"
    | "black"
    | "gold";
}

export function TextLogo({
  className,
  size = "md",
  variant = "light",
}: TextLogoProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const topTravelSizeClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-xs",
  };

  const variantClasses = {
    light: "text-corporate-blue",
    dark: "text-[#d64f39]",
    pink: "text-[#e03d90]",
    white: "text-white",
    wine: "text-wine",
    yellow: "text-yellow-400",
    black: "text-black",
    gold: "text-[#eaa298]",
  };

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <span
        className={cn(
          "font-['HomepageBaukasten-Bold'] leading-none tracking-wide",
          size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
          variantClasses[variant]
        )}
        style={{
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          fontWeight: "900",
          textShadow: "0 0 0.5px currentColor",
        }}
      >
        GABY
      </span>
      <span
        className={cn(
          "font-['BlarneyRegular'] leading-none -mt-0.5 tracking-wide relative",
          topTravelSizeClasses[size],
          variantClasses[variant]
        )}
        style={{
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          fontWeight: "bold",
          textShadow: "0 0 0.5px currentColor, 0 0 1px currentColor",
        }}
      >
        Top Travel
      </span>
    </div>
  );
}
