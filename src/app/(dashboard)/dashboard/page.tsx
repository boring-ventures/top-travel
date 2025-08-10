import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sections = [
  {
    title: "Offers",
    href: "/cms/offers",
    description: "Create and manage hero offers",
  },
  {
    title: "Packages",
    href: "/cms/packages",
    description: "Pre-built and custom packages",
  },
  {
    title: "Events",
    href: "/cms/events",
    description: "Concerts, sports and shows",
  },
  {
    title: "Fixed Departures",
    href: "/cms/fixed-departures",
    description: "Group trips with fixed dates",
  },
  {
    title: "Destinations",
    href: "/cms/destinations",
    description: "Cities and countries catalog",
  },
  {
    title: "Departments",
    href: "/cms/departments",
    description: "Weddings, Quinceañera themes",
  },
  {
    title: "Testimonials",
    href: "/cms/testimonials",
    description: "Customer quotes and ratings",
  },
  {
    title: "Pages",
    href: "/cms/pages",
    description: "Static pages with publish status",
  },
  {
    title: "WhatsApp Templates",
    href: "/cms/whatsapp-templates",
    description: "Lead message templates",
  },
];

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage content across all sections of the public site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.href} className="group">
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                size="sm"
                className="group-hover:translate-x-px transition-transform"
              >
                <Link href={s.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
