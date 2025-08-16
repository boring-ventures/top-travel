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
import { TeamSwitcher } from "./team-switcher";
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
} from "lucide-react";
import type { NavGroupProps } from "./types";

const baseNavGroups: NavGroupProps[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      { title: "Offers", url: "/cms/offers", icon: Tag },
      { title: "Packages", url: "/cms/packages", icon: Package },
      { title: "Events", url: "/cms/events", icon: CalendarDays },
      {
        title: "Fixed Departures",
        url: "/cms/fixed-departures",
        icon: PlaneTakeoff,
      },
      { title: "Destinations", url: "/cms/destinations", icon: MapPin },
      { title: "Tags", url: "/cms/tags", icon: Tags },
      { title: "Departments", url: "/cms/departments", icon: Building2 },
      {
        title: "Testimonials",
        url: "/cms/testimonials",
        icon: MessageSquare,
      },
      { title: "Pages", url: "/cms/pages", icon: FileText },
      {
        title: "WhatsApp Templates",
        url: "/cms/whatsapp-templates",
        icon: MessageSquareText,
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        title: "Settings",
        icon: Settings,
        url: "/settings",
      },
      {
        title: "Help Center",
        url: "/help-center",
        icon: HelpCircle,
      },
    ],
  },
];

const adminNavGroup: NavGroupProps = {
  title: "Administration",
  items: [
    {
      title: "Admin Panel",
      url: "/admin",
      icon: Shield,
    },
  ],
};

// Default team for the TeamSwitcher
const defaultTeams = [
  {
    name: "Top Travel",
    logo: Command,
    plan: "Admin Panel",
  },
];

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
        <TeamSwitcher teams={defaultTeams} />
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
