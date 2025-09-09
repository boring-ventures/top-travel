import {
  LayoutDashboard,
  MapPin,
  Tag,
  Package,
  CalendarDays,
  PlaneTakeoff,
  Tags,
  Building2,
  MessageSquare,
  MessageSquareText,
  Heart,
  Crown,
  BookOpen,
  Settings,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Panel Principal",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        { title: "Ofertas", url: "/cms/offers", icon: Tag },
        { title: "Paquetes", url: "/cms/packages", icon: Package },
        { title: "Eventos", url: "/cms/events", icon: CalendarDays },
        {
          title: "Salidas Fijas",
          url: "/cms/fixed-departures",
          icon: PlaneTakeoff,
        },
        { title: "Destinos", url: "/cms/destinations", icon: MapPin },
        { title: "Etiquetas", url: "/cms/tags", icon: Tags },
        {
          title: "Testimonios",
          url: "/cms/testimonials",
          icon: MessageSquare,
        },
        {
          title: "Plantillas WhatsApp",
          url: "/cms/whatsapp-templates",
          icon: MessageSquareText,
        },
      ],
    },
    {
      title: "Bodas y Quinceañeras",
      items: [
        {
          title: "Contenido de Páginas",
          url: "/cms/departments",
          icon: Building2,
        },
        {
          title: "Destinos de Bodas",
          url: "/cms/wedding-destinations",
          icon: Heart,
        },
        {
          title: "Destinos de Quinceañeras",
          url: "/cms/quinceanera-destinations",
          icon: Crown,
        },
        {
          title: "Blog Posts",
          url: "/cms/blog-posts",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Otros",
      items: [
        {
          title: "Configuración",
          icon: Settings,
          url: "/settings",
        },
      ],
    },
  ],
};
