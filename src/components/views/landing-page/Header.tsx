"use client";

import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react";
import { AuthHeader } from "./auth-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextLogo } from "@/components/ui/text-logo";
import Image from "next/image";

const navItems = [
  { href: "/destinations", label: "Destinos" },
  { href: "/packages", label: "Paquetes" },
  { href: "/events", label: "Eventos" },
  { href: "/weddings", label: "Bodas" },
  { href: "/quinceanera", label: "Quinceañeras" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

export default function Header() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 30;
          setIsScrolled(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-50 w-full group"
      >
        <div
          className={cn(
            "w-full backdrop-blur-xl border border-border/10",
            "bg-white/10 dark:bg-black/10 transition-all duration-300 ease-out",
            !isScrolled && "px-4 sm:px-6 lg:px-8 xl:px-12",
            isScrolled &&
              "bg-white/60 dark:bg-black/60 rounded-xl border backdrop-blur-2xl shadow-lg mx-auto w-full max-w-[95vw] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px] px-6 sm:px-8 lg:px-10 xl:px-12 mt-4"
          )}
        >
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-4 py-2 lg:gap-0 lg:py-3 transition-all duration-300 ease-out",
              isScrolled && "py-5 lg:py-4"
            )}
          >
            {/* Left: brand + mobile menu button */}
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-2"
              >
                <Image
                  src="/logos/iso_blue.svg"
                  alt="Logo"
                  width={48}
                  height={38}
                  className={cn(
                    "transition-all duration-300 ease-out dark:hidden",
                    isScrolled && "w-12 h-9.5"
                  )}
                />
                <Image
                  src="/logos/iso_white.svg"
                  alt="Logo"
                  width={48}
                  height={38}
                  className={cn(
                    "transition-all duration-300 ease-out hidden dark:block",
                    isScrolled && "w-12 h-9.5"
                  )}
                />
                <TextLogo
                  variant="light"
                  size={isScrolled ? "md" : "lg"}
                  className="transition-all duration-300 ease-out"
                />
              </Link>
              <button
                onClick={() => setMenuState((v) => !v)}
                aria-label={menuState ? "Cerrar menú" : "Abrir menú"}
                className={cn(
                  "relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5 lg:hidden",
                  isScrolled ? "text-primary dark:text-white" : "text-white"
                )}
              >
                <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Center: desktop nav */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul
                className={cn(
                  "flex gap-6 text-sm transition-all duration-300 ease-out",
                  isScrolled && "gap-5 text-xs"
                )}
              >
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block duration-150",
                        isScrolled
                          ? "text-foreground/90 hover:text-foreground"
                          : "text-white/90 hover:text-white"
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: auth / CTAs */}
            <div className="bg-background/80 backdrop-blur-xl group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none">
              {/* Mobile nav list when open */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block duration-150",
                          isScrolled
                            ? "text-foreground/90 hover:text-foreground"
                            : "text-white/90 hover:text-white"
                        )}
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
                {/* Contact Us button */}
                <Button
                  asChild
                  size={isScrolled ? "sm" : "sm"}
                  className={cn(
                    "transition-colors duration-300 ease-out",
                    isScrolled
                      ? "bg-primary text-primary-foreground text-sm px-4 py-2 sm:text-xs sm:px-3 sm:py-1"
                      : "bg-white text-black hover:bg-white/90 text-sm px-4 py-2 sm:text-xs sm:px-3 sm:py-1"
                  )}
                >
                  <Link href="/contact">
                    <span>Contactar</span>
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
