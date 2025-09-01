"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { usePublishedBlogPosts } from "@/hooks/use-blog-posts";
import { DepartmentType } from "@prisma/client";

export default function BlogPage() {
  const [selectedType, setSelectedType] = useState<DepartmentType | "ALL">(
    "ALL"
  );
  const { data: blogData, isLoading } = usePublishedBlogPosts({
    page: 1,
    limit: 20, // Show more posts on the main blog page
    ...(selectedType !== "ALL" && { type: selectedType }),
  });

  const posts = blogData?.posts || [];

  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeLabel = (type: DepartmentType) => {
    return type === DepartmentType.WEDDINGS ? "Bodas" : "Quinceañeras";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Cargando blog...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Descubre consejos, tendencias y experiencias para hacer de tu evento
          especial un momento inolvidable
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-muted p-1 rounded-lg">
          <Button
            variant={selectedType === "ALL" ? "default" : "ghost"}
            onClick={() => setSelectedType("ALL")}
            className="px-6"
          >
            Todos
          </Button>
          <Button
            variant={
              selectedType === DepartmentType.WEDDINGS ? "default" : "ghost"
            }
            onClick={() => setSelectedType(DepartmentType.WEDDINGS)}
            className="px-6"
          >
            Bodas
          </Button>
          <Button
            variant={
              selectedType === DepartmentType.QUINCEANERA ? "default" : "ghost"
            }
            onClick={() => setSelectedType(DepartmentType.QUINCEANERA)}
            className="px-6"
          >
            Quinceañeras
          </Button>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">
            No hay posts disponibles
          </h3>
          <p className="text-muted-foreground">
            {selectedType === "ALL"
              ? "Aún no hemos publicado ningún post en el blog."
              : `No hay posts publicados para ${getTypeLabel(selectedType).toLowerCase()}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.heroImageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.heroImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{getTypeLabel(post.type)}</Badge>
                  {post.publishedAt && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.publishedAt)}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {post.author && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Leer más
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
