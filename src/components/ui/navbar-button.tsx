"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface NavbarButtonProps {
  asChild?: boolean;
  size?: "sm" | "lg";
  className?: string;
  children: ReactNode;
  primaryColor?: string;
  hoverColor?: string;
  href?: string;
  onClick?: () => void;
}

export const NavbarButton = ({
  asChild = false,
  size = "sm",
  className,
  children,
  primaryColor = "#e03d90",
  hoverColor = "#c8327a",
  href,
  onClick,
  ...props
}: NavbarButtonProps) => {
  const buttonStyle = {
    backgroundColor: primaryColor,
    color: "white",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = hoverColor;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = primaryColor;
  };

  const buttonElement = (
    <Button
      asChild={asChild}
      size={size}
      className={cn(
        "rounded-full transition-all duration-300 hover:scale-105",
        className
      )}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );

  if (href && asChild) {
    return (
      <Link href={href} onClick={onClick}>
        {buttonElement}
      </Link>
    );
  }

  return buttonElement;
};
