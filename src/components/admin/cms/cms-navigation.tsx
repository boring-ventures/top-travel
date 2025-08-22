"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Calendar,
  Plane,
  Tag,
  MessageSquare,
  Star,
  Users,
  FileText,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Panel Principal",
    href: "/cms",
    icon: LayoutDashboard,
    description: "Vista general del CMS",
  },
  {
    name: "Contenido",
    items: [
      {
        name: "Destinos",
        href: "/cms/destinations",
        icon: MapPin,
        description: "Gestionar ciudades y países",
      },
      {
        name: "Paquetes",
        href: "/cms/packages",
        icon: Package,
        description: "Paquetes turísticos",
      },
      {
        name: "Eventos",
        href: "/cms/events",
        icon: Calendar,
        description: "Conciertos y eventos",
      },
      {
        name: "Salidas Fijas",
        href: "/cms/fixed-departures",
        icon: Plane,
        description: "Viajes con fechas fijas",
      },
      {
        name: "Ofertas",
        href: "/cms/offers",
        icon: Gift,
        description: "Promociones y ofertas especiales",
      },
    ],
  },
  {
    name: "Organización",
    items: [
      {
        name: "Etiquetas",
        href: "/cms/tags",
        icon: Tag,
        description: "Taxonomía y categorización",
      },
    ],
  },
  {
    name: "Interacción",
    items: [
      {
        name: "Testimonios",
        href: "/cms/testimonials",
        icon: Star,
        description: "Reseñas de clientes",
      },
      {
        name: "WhatsApp Templates",
        href: "/cms/whatsapp-templates",
        icon: MessageSquare,
        description: "Plantillas de mensajes",
      },
    ],
  },
];

export function CmsNavigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {navigation.map((section) => (
        <div key={section.name} className="space-y-3">
          {section.href ? (
            <Link
              href={section.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === section.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <section.icon className="h-4 w-4" />
              {section.name}
            </Link>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-muted-foreground px-3">
                {section.name}
              </h3>
              <div className="space-y-1">
                {section.items?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div
                        className={cn(
                          "text-xs",
                          pathname === item.href
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </nav>
  );
}
