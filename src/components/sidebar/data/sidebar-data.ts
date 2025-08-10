import {
  AlertCircle,
  AppWindow,
  AudioWaveform,
  Ban,
  Bug,
  CheckSquare,
  Command,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LockKeyhole,
  MessageSquare,
  Settings,
  ServerCrash,
  UserX,
  Users,
  MapPin,
  Tag,
  Package,
  CalendarDays,
  PlaneTakeoff,
  Tags,
  Building2,
  FileText,
  MessageSquareText,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
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
  ],
};
