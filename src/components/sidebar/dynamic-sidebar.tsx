"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { useAuth } from "@/providers/auth-provider";
import { UserRole } from "@prisma/client";
import {
  LayoutDashboard,
  Tag,
  Package,
  CalendarDays,
  PlaneTakeoff,
  MapPin,
  Tags,
  Building2,
  MessageSquare,
  FileText,
  MessageSquareText,
  Settings,
  HelpCircle,
  Shield,
  Command,
  Heart,
  Crown,
  BookOpen,
  Users,
} from "lucide-react";
import type { NavGroupProps } from "./types";

const baseNavGroups: NavGroupProps[] = [
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
];

const adminNavGroup: NavGroupProps = {
  title: "Administración",
  items: [
    {
      title: "Gestión de Usuarios",
      url: "/cms/users",
      icon: Users,
    },
  ],
};

export function DynamicSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === UserRole.SUPERADMIN;

  // Add admin nav group if user is SUPERADMIN
  const navGroups = isSuperAdmin
    ? [...baseNavGroups, adminNavGroup]
    : baseNavGroups;

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        {/* Team switcher removed - no functionality needed */}
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((navGroup: NavGroupProps) => (
          <NavGroup key={navGroup.title} {...navGroup} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
