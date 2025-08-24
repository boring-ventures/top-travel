import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  MapPin,
  CalendarDays,
  Tag,
  Users,
  TrendingUp,
  PlaneTakeoff,
  MessageSquare,
  FileText,
  Building2,
  Plus,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Crown,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
    },
  });

  // If no profile exists, create one
  if (!profile) {
    const mockSuperadmin = process.env.MOCK_SUPERADMIN === "true";
    const defaultRole = mockSuperadmin ? "SUPERADMIN" : "USER";

    await prisma.profile.create({
      data: {
        userId,
        firstName: null,
        lastName: null,
        avatarUrl: null,
        active: true,
        role: defaultRole,
      },
    });

    // Redirect to refresh the page with the new profile
    redirect("/dashboard");
  }

  // Fetch dashboard statistics
  const [
    totalPackages,
    totalDestinations,
    totalEvents,
    totalFixedDepartures,
    totalOffers,
    totalTestimonials,
    totalWhatsAppTemplates,
    totalWeddingDestinations,
    totalQuinceaneraDestinations,
    totalBlogPosts,
    recentPackages,
    recentDestinations,
    recentEvents,
    pendingTestimonials,
    upcomingFixedDepartures,
  ] = await Promise.all([
    // Count statistics
    prisma.package.count(),
    prisma.destination.count(),
    prisma.event.count(),
    prisma.fixedDeparture.count(),
    prisma.offer.count(),
    prisma.testimonial.count(),
    prisma.whatsAppTemplate.count(),
    prisma.weddingDestination.count(),
    prisma.quinceaneraDestination.count(),
    prisma.blogPost.count(),

    // Recent packages
    prisma.package.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        slug: true,
      },
    }),

    // Recent destinations
    prisma.destination.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        city: true,
        country: true,
        isFeatured: true,
        createdAt: true,
        slug: true,
      },
    }),

    // Recent events
    prisma.event.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        title: true,
        startDate: true,
        status: true,
        slug: true,
      },
    }),

    // Pending testimonials
    prisma.testimonial.findMany({
      where: { status: "PENDING" },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        authorName: true,
        content: true,
        createdAt: true,
      },
    }),

    // Upcoming fixed departures
    prisma.fixedDeparture.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      take: 5,
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        slug: true,
      },
    }),
  ]);

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    session.user.email;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Publicado
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="secondary">
            <Edit className="w-3 h-3 mr-1" />
            Borrador
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 text-yellow-700"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel Principal</h2>
          <p className="text-muted-foreground">
            Bienvenido de vuelta, {displayName}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {profile.role === "SUPERADMIN" ? "Administrador" : "Usuario"}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paquetes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDestinations}</div>
            <p className="text-xs text-muted-foreground">
              +1 desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">+3 eventos próximos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOffers}</div>
            <p className="text-xs text-muted-foreground">+1 oferta activa</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas Fijas</CardTitle>
            <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFixedDepartures}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingFixedDepartures.length} próximas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonios</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestimonials}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTestimonials.length} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plantillas WhatsApp
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWhatsAppTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Plantillas configuradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Destinos de Bodas
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeddingDestinations}</div>
            <p className="text-xs text-muted-foreground">
              Destinos especializados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Destinos de Quinceañeras
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQuinceaneraDestinations}
            </div>
            <p className="text-xs text-muted-foreground">
              Destinos especializados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">Posts publicados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Packages */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Paquetes Recientes</CardTitle>
            <CardDescription>
              Últimos paquetes agregados al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {pkg.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Creado: {formatDate(pkg.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(pkg.status)}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/cms/packages/${pkg.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/cms/packages">Ver todos los paquetes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Acciones frecuentes del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/packages/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Paquete
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/destinations/new">
                  <MapPin className="mr-2 h-4 w-4" />
                  Nuevo Destino
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/events/new">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Nuevo Evento
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/offers/new">
                  <Tag className="mr-2 h-4 w-4" />
                  Nueva Oferta
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/fixed-departures/new">
                  <PlaneTakeoff className="mr-2 h-4 w-4" />
                  Nueva Salida Fija
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/wedding-destinations">
                  <Heart className="mr-2 h-4 w-4" />
                  Gestionar Bodas
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/quinceanera-destinations">
                  <Crown className="mr-2 h-4 w-4" />
                  Gestionar Quinceañeras
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/cms/blog-posts">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Gestionar Blog
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Destinations and Upcoming Departures */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Destinations */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Destinos Recientes</CardTitle>
            <CardDescription>Últimos destinos agregados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {dest.city}, {dest.country}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Agregado: {formatDate(dest.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dest.isFeatured && (
                      <Badge variant="secondary">Destacado</Badge>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/cms/destinations/${dest.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Fixed Departures */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximas Salidas Fijas</CardTitle>
            <CardDescription>
              Salidas programadas en los próximos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFixedDepartures.map((departure) => (
                <div
                  key={departure.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {departure.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(departure.startDate)} -{" "}
                        {formatDate(departure.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(departure.status)}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/cms/fixed-departures/${departure.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Testimonials */}
      {pendingTestimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
              Testimonios Pendientes
            </CardTitle>
            <CardDescription>
              Testimonios que requieren revisión y aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{testimonial.authorName}</p>
                    <Badge
                      variant="outline"
                      className="border-yellow-200 text-yellow-700"
                    >
                      Pendiente
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {testimonial.content.substring(0, 150)}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enviado: {formatDate(testimonial.createdAt)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/cms/testimonials">
                  Revisar todos los testimonios
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
