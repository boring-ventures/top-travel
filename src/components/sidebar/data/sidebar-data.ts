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
      name: "Admin Shadcn",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Empresa",
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
        { title: "Departamentos", url: "/cms/departments", icon: Building2 },
        {
          title: "Testimonios",
          url: "/cms/testimonials",
          icon: MessageSquare,
        },
        { title: "Páginas", url: "/cms/pages", icon: FileText },
        {
          title: "Plantillas WhatsApp",
          url: "/cms/whatsapp-templates",
          icon: MessageSquareText,
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
        {
          title: "Centro de Ayuda",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
