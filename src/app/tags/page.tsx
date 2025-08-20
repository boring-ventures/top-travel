import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Package, MapPin, ArrowRight } from "lucide-react";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { pageMeta } from "@/lib/seo";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          packageTags: true,
          destinationTags: true,
        },
      },
    },
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "REGION":
        return "Región";
      case "THEME":
        return "Tema";
      case "DEPARTMENT":
        return "Departamento";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REGION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "THEME":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DEPARTMENT":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "REGION":
        return <MapPin className="h-4 w-4" />;
      case "THEME":
        return <Tag className="h-4 w-4" />;
      case "DEPARTMENT":
        return <Package className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  // Group tags by type
  const tagsByType = tags.reduce(
    (acc, tag) => {
      if (!acc[tag.type]) {
        acc[tag.type] = [];
      }
      acc[tag.type].push(tag);
      return acc;
    },
    {} as Record<string, typeof tags>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative pt-16 sm:pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explorar por Etiquetas
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Descubre destinos, temas y experiencias organizadas por
                categorías
              </p>
            </div>
          </div>
        </section>

        {/* Tags Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {Object.entries(tagsByType).map(([type, typeTags]) => (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(type)}
                  <h2 className="text-2xl font-bold text-foreground">
                    {getTypeLabel(type)}
                  </h2>
                  <Badge className={getTypeColor(type)}>
                    {typeTags.length} etiqueta{typeTags.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeTags.map((tag) => (
                    <Card
                      key={tag.id}
                      className="p-6 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tag.type)}
                          <h3 className="font-semibold text-lg text-foreground">
                            {tag.name}
                          </h3>
                        </div>
                        <Badge className={getTypeColor(tag.type)}>
                          {getTypeLabel(tag.type)}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>
                              {tag._count.packageTags} paquete
                              {tag._count.packageTags !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {tag._count.destinationTags} destino
                              {tag._count.destinationTags !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link href={`/tags/${tag.slug}`}>
                              Ver contenido
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/packages?tagId=${tag.id}`}>
                              Paquetes
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 border-0">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Explorar más contenido
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Link href="/packages">
                    <Package className="h-6 w-6" />
                    <span>Ver todos los paquetes</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Link href="/destinations">
                    <MapPin className="h-6 w-6" />
                    <span>Explorar destinos</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Link href="/events">
                    <Tag className="h-6 w-6" />
                    <span>Eventos y conciertos</span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const metadata = pageMeta({
  title: "Explorar por Etiquetas",
  description:
    "Descubre destinos, temas y experiencias organizadas por categorías. Navega por nuestras etiquetas para encontrar el contenido que más te interesa.",
  urlPath: "/tags",
});
