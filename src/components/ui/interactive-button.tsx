"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InteractiveButtonProps {
  asChild?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  primaryColor?: string;
  hoverColor?: string;
}

export const InteractiveButton = ({
  asChild = false,
  variant = "default",
  size = "default",
  className,
  style,
  children,
  primaryColor = "#e03d90",
  hoverColor = "#c8327a",
  ...props
}: InteractiveButtonProps) => {
  const isOutline = variant === "outline";

  const baseStyle = isOutline
    ? {
        borderColor: primaryColor,
        color: primaryColor,
        backgroundColor: "transparent",
        ...style,
      }
    : {
        backgroundColor: primaryColor,
        color: "white",
        ...style,
      };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOutline) {
      e.currentTarget.style.backgroundColor = primaryColor;
      e.currentTarget.style.color = "white";
    } else {
      e.currentTarget.style.backgroundColor = hoverColor;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOutline) {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = primaryColor;
    } else {
      e.currentTarget.style.backgroundColor = primaryColor;
    }
  };

  return (
    <Button
      asChild={asChild}
      variant={variant}
      size={size}
      className={cn("transition-colors duration-200", className)}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Button>
  );
};
