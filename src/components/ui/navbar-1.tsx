"use client" 

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TextLogo } from "./text-logo"
import { useAuth } from "@/providers/auth-provider"
import DashboardButton from "@/components/dashboard/dashboard-button"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/destinations", label: "Destinos" },
  { href: "/packages", label: "Paquetes" },
  { href: "/events", label: "Eventos" },
  { href: "/weddings", label: "Bodas" },
  { href: "/quinceanera", label: "Quinceañeras" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  
  // Páginas que necesitan header con fondo rosado
  const isPinkHeaderPage = pathname === "/quinceanera";
  
  // Páginas que necesitan header con fondo rosado y color dorado
  const isGoldHeaderPage = pathname === "/weddings";
  
  // Páginas que necesitan header con texto y logos blancos
  const isWhiteHeaderPage = pathname === "/destinations" || pathname === "/packages";
  
  // Páginas que necesitan detalles de color vino
  const isWineDetailsPage = pathname === "/packages" || pathname === "/destinations";
  
  // Páginas que necesitan detalles de color negro
  const isBlackDetailsPage = pathname === "/events";
  
  // Páginas que necesitan header con fondo azul corporativo
  const isBlueHeaderPage = pathname === "/about" || pathname === "/contact";

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 pb-4 px-4">
             <div className={cn(
         "flex items-center justify-between px-6 py-3 rounded-[3rem] shadow-2xl w-full max-w-5xl relative z-10 backdrop-blur-2xl border",
         isPinkHeaderPage 
           ? "bg-rose-50/20 border-rose-200/30" 
           : isGoldHeaderPage
           ? "bg-rose-50/20 border-rose-200/30"
           : isBlackDetailsPage
           ? "bg-white/90 border-gray-200/50"
           : isWhiteHeaderPage
           ? "bg-black/20 border-white/30"
           : isBlueHeaderPage
           ? "bg-white/90 border-gray-200/50"
           : "bg-white/20 border-white/30"
       )}>
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
               src={isPinkHeaderPage ? "/logos/iso_white.svg" : isWhiteHeaderPage ? "/logos/iso_white.svg" : isBlueHeaderPage ? "/logos/iso_blue.svg" : isBlackDetailsPage ? "/logos/iso_blue.svg" : "/logos/iso_blue.svg"}
               alt="Logo"
               width={28}
               height={22}
               className={cn(
                 "transition-all duration-300 ease-out",
                 isPinkHeaderPage && "brightness-0 saturate-100 hue-rotate-[300deg] sepia-100",
                 isBlackDetailsPage && "brightness-0"
               )}
             />
            <TextLogo
              variant={isPinkHeaderPage ? "pink" : isGoldHeaderPage ? "gold" : isWineDetailsPage ? "wine" : isBlackDetailsPage ? "black" : isWhiteHeaderPage ? "white" : isBlueHeaderPage ? "dark" : "dark"}
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
                    ? "text-rose-600 hover:text-rose-700"
                    : isGoldHeaderPage
                    ? "text-gold hover:text-gold/80"
                    : isBlackDetailsPage
                    ? "text-black hover:text-black/80"
                    : isWhiteHeaderPage
                    ? "text-white hover:text-white/80"
                    : isBlueHeaderPage
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-corporate-blue hover:text-corporate-blue/80"
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                  isPinkHeaderPage ? "bg-rose-500" : isGoldHeaderPage ? "bg-gold" : isWineDetailsPage ? "bg-wine" : isBlackDetailsPage ? "bg-black" : isWhiteHeaderPage ? "bg-white" : isBlueHeaderPage ? "bg-corporate-blue" : "bg-corporate-blue"
                )} />
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
            <div className="h-9 w-[100px] animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DashboardButton />
          ) : (
            <Button
              asChild
              size="sm"
              className={cn(
                "rounded-full transition-all duration-300 hover:scale-105",
                isPinkHeaderPage
                  ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200/50"
                  : isGoldHeaderPage
                  ? "bg-gold text-white hover:bg-gold-light shadow-gold/50"
                  : isWineDetailsPage
                  ? "bg-wine text-white hover:bg-wine-light shadow-wine/50"
                  : isBlackDetailsPage
                  ? "bg-black text-white hover:bg-gray-800 shadow-black/50"
                  : isBlueHeaderPage
                  ? "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <Link href="/sign-in">
                Sign In
              </Link>
            </Button>
          )}
          
          <Button
            asChild
            size="sm"
            className={cn(
              "rounded-full transition-all duration-300 hover:scale-105",
              isPinkHeaderPage
                ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200/50"
                : isGoldHeaderPage
                ? "bg-gold text-white hover:bg-gold-light shadow-gold/50"
                : isWineDetailsPage
                ? "bg-wine text-white hover:bg-wine-light shadow-wine/50"
                : isBlackDetailsPage
                ? "bg-black text-white hover:bg-gray-800 shadow-black/50"
                : isWhiteHeaderPage
                ? "bg-white text-black hover:bg-white/90 shadow-white/50"
                : isBlueHeaderPage
                ? "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
                : "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
            )}
          >
            <Link href="/contact">
              Contactar
            </Link>
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className={cn(
            "lg:hidden flex items-center p-2 rounded-lg transition-colors",
            isPinkHeaderPage ? "hover:bg-rose-500/20" : isGoldHeaderPage ? "hover:bg-gold/20" : isWineDetailsPage ? "hover:bg-wine/20" : isBlackDetailsPage ? "hover:bg-black/10" : isBlueHeaderPage ? "hover:bg-gray-100/50" : "hover:bg-gray-100/50"
          )}
          onClick={toggleMenu} 
          whileTap={{ scale: 0.95 }}
        >
          <Menu className={cn(
            "h-6 w-6",
            isPinkHeaderPage ? "text-rose-500" : isGoldHeaderPage ? "text-gold" : isBlackDetailsPage ? "text-black" : isWhiteHeaderPage ? "text-white" : isBlueHeaderPage ? "text-gray-700" : "text-corporate-blue"
          )} />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed inset-0 z-50 pt-20 px-6 lg:hidden backdrop-blur-md",
              isPinkHeaderPage ? "bg-rose-50/95" : isGoldHeaderPage ? "bg-gold/10" : isBlackDetailsPage ? "bg-white/95" : isWhiteHeaderPage ? "bg-black/95" : isBlueHeaderPage ? "bg-white/95" : "bg-white/95"
            )}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className={cn(
                "absolute top-6 right-6 p-3 rounded-full transition-colors",
                isPinkHeaderPage 
                  ? "bg-rose-100 hover:bg-rose-200" 
                  : isGoldHeaderPage
                  ? "bg-gold/20 hover:bg-gold/30"
                  : isBlackDetailsPage
                  ? "bg-gray-100 hover:bg-gray-200"
                  : isWhiteHeaderPage
                  ? "bg-white/20 hover:bg-white/30"
                  : isBlueHeaderPage
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className={cn(
                "h-6 w-6",
                isPinkHeaderPage ? "text-rose-600" : isGoldHeaderPage ? "text-gold" : isBlackDetailsPage ? "text-gray-700" : isWhiteHeaderPage ? "text-white" : isBlueHeaderPage ? "text-gray-700" : "text-gray-700"
              )} />
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
                        ? "text-rose-600 hover:text-rose-700"
                        : isGoldHeaderPage
                        ? "text-gold hover:text-gold/80"
                        : isBlackDetailsPage
                        ? "text-black hover:text-black/80"
                        : isWhiteHeaderPage
                        ? "text-white hover:text-white/80"
                        : isBlueHeaderPage
                        ? "text-gray-700 hover:text-gray-900"
                        : "text-corporate-blue hover:text-corporate-blue/80"
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
                    <div className="h-12 w-full animate-pulse rounded-full bg-muted" />
                  ) : user ? (
                    <DashboardButton />
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className={cn(
                        "w-full rounded-full",
                        isPinkHeaderPage
                          ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200/50"
                          : isGoldHeaderPage
                          ? "bg-gold text-white hover:bg-gold-light shadow-gold/50"
                          : isWineDetailsPage
                          ? "bg-wine text-white hover:bg-wine-light shadow-wine/50"
                          : isBlackDetailsPage
                          ? "bg-black text-white hover:bg-gray-800 shadow-black/50"
                          : isBlueHeaderPage
                          ? "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
                          : "bg-primary text-primary-foreground"
                      )}
                      onClick={toggleMenu}
                    >
                      <Link href="/sign-in">
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
                
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "w-full rounded-full transition-all duration-300",
                    isPinkHeaderPage
                      ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200/50"
                      : isGoldHeaderPage
                      ? "bg-gold text-white hover:bg-gold-light shadow-gold/50"
                      : isWineDetailsPage
                      ? "bg-wine text-white hover:bg-wine-light shadow-wine/50"
                      : isBlackDetailsPage
                      ? "bg-black text-white hover:bg-gray-800 shadow-black/50"
                      : isWhiteHeaderPage
                      ? "bg-white text-black hover:bg-white/90 shadow-white/50"
                      : isBlueHeaderPage
                      ? "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
                      : "bg-corporate-blue text-white hover:bg-corporate-blue/90 shadow-blue-200/50"
                  )}
                  onClick={toggleMenu}
                >
                  <Link href="/contact">
                    Contactar
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }
