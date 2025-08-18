"use client";

import Link from "next/link";
import React from "react";
import { Menu, X, Globe2 } from "lucide-react";
import { AuthHeader } from "./auth-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/destinations", label: "Destinos" },
  { href: "/packages", label: "Paquetes" },
  { href: "/events", label: "Eventos" },
  { href: "/fixed-departures", label: "Salidas Fijas" },
  { href: "/weddings", label: "Bodas" },
  { href: "/quinceanera", label: "Quinceañera" },
  { href: "/about", label: "Nosotros" },
];

export default function Header() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-50 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-1 max-w-6xl px-4 sm:px-6 lg:px-12 transition-all duration-300",
            isScrolled &&
              "bg-background/60 backdrop-blur-2xl border border-border/50 rounded-2xl max-w-5xl lg:px-8"
          )}
        >
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-4 py-2 lg:gap-0 lg:py-3"
            )}
          >
            {/* Left: brand + mobile menu button */}
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-2"
              >
                <Globe2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm sm:text-base font-bold tracking-tight text-primary">
                  GABYTOPTRAVEL
                </span>
              </Link>
              <button
                onClick={() => setMenuState((v) => !v)}
                aria-label={menuState ? "Cerrar menú" : "Abrir menú"}
                className="relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Center: desktop nav */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-6 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block text-muted-foreground hover:text-foreground/90 duration-150"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: auth / CTAs */}
            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none">
              {/* Mobile nav list when open */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground hover:text-foreground duration-150"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {/* Keep existing auth actions */}
                <div className={cn(isScrolled ? "lg:hidden" : "")}>
                  <AuthHeader />
                </div>
                {/* Optional primary CTA visible when scrolled on desktop */}
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    isScrolled ? "hidden lg:inline-flex" : "hidden"
                  )}
                >
                  <Link href="/packages">
                    <span>Explorar paquetes</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
