"use client";

import Link from "next/link";
import { Menu, Globe2 } from "lucide-react";
import { AuthHeader } from "./auth-header";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3">
          <div className="flex items-center gap-2">
            <Globe2 className="h-7 w-7 text-primary" aria-hidden="true" />
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-tight text-primary"
            >
              GABYTOPTRAVEL
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/90 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex">
            <AuthHeader />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                aria-label="Abrir menú"
                className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <Menu size={18} />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-primary">
                    <Globe2 className="h-5 w-5" /> GABYTOPTRAVEL
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="px-3 pt-2">
                    <AuthHeader />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
