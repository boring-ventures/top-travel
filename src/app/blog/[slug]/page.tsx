"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useBlogPostBySlug } from "@/hooks/use-blog-posts";
import { DepartmentType } from "@prisma/client";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = useBlogPostBySlug(slug);

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

  const formatContent = (content: string) => {
    // Convert line breaks to paragraphs
    return content.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") return null;
      return (
        <p key={index} className="mb-4 text-lg leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Cargando post...</h1>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El post que buscas no existe o no está disponible.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        {/* Hero Image */}
        {post.heroImageUrl && (
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.heroImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge variant="outline" className="text-sm">
            {getTypeLabel(post.type)}
          </Badge>

          {post.publishedAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(post.publishedAt)}
            </div>
          )}

          {post.author && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              Por {post.author}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
            {post.excerpt}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {formatContent(post.content)}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Publicado el {formatDate(post.publishedAt)}
              {post.author && ` por ${post.author}`}
            </div>
            <Link href="/blog">
              <Button variant="outline">Ver más posts</Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}


