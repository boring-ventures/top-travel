"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TextLogo } from "./text-logo";
import { useAuth } from "@/providers/auth-provider";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { Button } from "./button";
import { NavbarButton } from "./navbar-button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/offers", label: "Ofertas" },
  { href: "/destinations", label: "Destinos" },
  { href: "/packages", label: "Paquetes" },
  { href: "/events", label: "Eventos" },
  { href: "/weddings", label: "Bodas" },
  { href: "/quinceanera", label: "Quinceañeras" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // Safety check to prevent hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Páginas que necesitan header con fondo rosado (PRESERVAR)
  const isPinkHeaderPage =
    pathname === "/quinceanera" ||
    pathname.startsWith("/quinceanera-destinations");

  // Páginas que necesitan header con fondo rosado para weddings (PRESERVAR)
  const isWeddingsHeaderPage =
    pathname === "/weddings" || pathname.startsWith("/wedding-destinations");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 pb-4 px-4">
      <div
        className={cn(
          "flex items-center justify-between px-6 py-3 rounded-[3rem] shadow-2xl w-full max-w-5xl relative z-10 backdrop-blur-2xl border",
          isPinkHeaderPage
            ? "border-pink-200/30 bg-pink-50/20"
            : isWeddingsHeaderPage
              ? "border-pink-200/30 bg-pink-50/20"
              : "bg-white/60 border-gray-200/30"
        )}
      >
        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" aria-label="home" className="flex items-center gap-3">
            <Image
              src={
                isPinkHeaderPage
                  ? "/logos/quinceanera_logo.svg"
                  : isWeddingsHeaderPage
                    ? "/logos/bodas_logo.svg"
                    : "/logos/iso_blue.svg"
              }
              alt="Logo"
              width={44}
              height={34}
              className="transition-all duration-300 ease-out"
            />
            <TextLogo
              variant={
                isPinkHeaderPage
                  ? "pink"
                  : isWeddingsHeaderPage
                    ? "gold"
                    : "dark"
              }
              size="md"
              className="transition-all duration-300 ease-out"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative group",
                  isPinkHeaderPage
                    ? "text-[#e03d90] hover:opacity-80"
                    : isWeddingsHeaderPage
                      ? "text-[#eaa298] hover:text-[#eaa298]/80"
                      : "text-gray-700 hover:text-gray-900"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    isPinkHeaderPage
                      ? "bg-[#e03d90]"
                      : isWeddingsHeaderPage
                        ? "bg-[#eaa298]"
                        : "bg-corporate-blue"
                  )}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <motion.div
          className="hidden lg:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* Auth Button */}
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse flex items-center justify-center">
              <div className="w-5 h-5 bg-muted-foreground/30 rounded" />
            </div>
          ) : user ? (
            <DashboardButton
              variant={
                isPinkHeaderPage
                  ? "pink"
                  : isWeddingsHeaderPage
                    ? "gold"
                    : "default"
              }
            />
          ) : isPinkHeaderPage ? (
            <NavbarButton
              asChild
              size="sm"
              className="shadow-pink-200/50"
              primaryColor="#e03d90"
              hoverColor="#c8327a"
              href="/sign-in"
            >
              Sign In
            </NavbarButton>
          ) : isWeddingsHeaderPage ? (
            <NavbarButton
              asChild
              size="sm"
              className="shadow-pink-200/50"
              primaryColor="#eaa298"
              hoverColor="#d49186"
              href="/sign-in"
            >
              Sign In
            </NavbarButton>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-full transition-all duration-300 hover:scale-105 bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className={cn(
            "lg:hidden flex items-center p-2 rounded-lg transition-colors",
            isPinkHeaderPage || isWeddingsHeaderPage
              ? "hover:bg-pink-500/20"
              : "hover:bg-gray-100/50"
          )}
          onClick={toggleMenu}
          whileTap={{ scale: 0.95 }}
        >
          <Menu
            className={cn(
              "h-6 w-6",
              isPinkHeaderPage
                ? "text-[#e03d90]"
                : isWeddingsHeaderPage
                  ? "text-[#eaa298]"
                  : "text-gray-700"
            )}
          />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed inset-0 z-50 pt-20 px-6 lg:hidden backdrop-blur-md",
              isPinkHeaderPage || isWeddingsHeaderPage
                ? "bg-pink-50/95"
                : "bg-white/95"
            )}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className={cn(
                "absolute top-6 right-6 p-3 rounded-full transition-colors",
                isPinkHeaderPage || isWeddingsHeaderPage
                  ? "bg-pink-100 hover:bg-pink-200"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X
                className={cn(
                  "h-6 w-6",
                  isPinkHeaderPage
                    ? "text-[#e03d90]"
                    : isWeddingsHeaderPage
                      ? "text-[#eaa298]"
                      : "text-gray-700"
                )}
              />
            </motion.button>

            <div className="flex flex-col space-y-8 max-w-md mx-auto">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1, duration: 0.4 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors block py-2",
                      isPinkHeaderPage
                        ? "text-[#e03d90] hover:opacity-80"
                        : isWeddingsHeaderPage
                          ? "text-[#eaa298] hover:text-[#eaa298]/80"
                          : "text-gray-700 hover:text-gray-900"
                    )}
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                exit={{ opacity: 0, y: 30 }}
                className="pt-8 space-y-4 border-t border-gray-200/50"
              >
                {/* Mobile Auth Button */}
                <div className="w-full">
                  {isLoading ? (
                    <div className="w-full h-12 rounded-full bg-muted animate-pulse flex items-center justify-center">
                      <div className="w-6 h-6 bg-muted-foreground/30 rounded" />
                    </div>
                  ) : user ? (
                    <DashboardButton
                      variant={
                        isPinkHeaderPage
                          ? "pink"
                          : isWeddingsHeaderPage
                            ? "gold"
                            : "default"
                      }
                    />
                  ) : isPinkHeaderPage ? (
                    <NavbarButton
                      asChild
                      size="lg"
                      className="w-full shadow-pink-200/50"
                      primaryColor="#e03d90"
                      hoverColor="#c8327a"
                      href="/sign-in"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </NavbarButton>
                  ) : isWeddingsHeaderPage ? (
                    <NavbarButton
                      asChild
                      size="lg"
                      className="w-full shadow-pink-200/50"
                      primaryColor="#eaa298"
                      hoverColor="#d49186"
                      href="/sign-in"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </NavbarButton>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className="w-full rounded-full bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
                      onClick={toggleMenu}
                    >
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Navbar1 };
