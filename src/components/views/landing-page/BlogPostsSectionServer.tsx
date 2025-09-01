import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { DepartmentType } from "@prisma/client";
import { ShineBorder } from "@/components/magicui/shine-border";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  heroImageUrl: string | null;
  author: string | null;
  publishedAt: Date | null;
  type: DepartmentType;
}

interface BlogPostsSectionServerProps {
  posts: BlogPost[];
  title: string;
  description: string;
  type?: DepartmentType;
}

export function BlogPostsSectionServer({
  posts,
  title,
  description,
  type = DepartmentType.WEDDINGS,
}: BlogPostsSectionServerProps) {
  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeLabel = (postType: DepartmentType) => {
    return postType === DepartmentType.WEDDINGS ? "Bodas" : "Quinceañeras";
  };

  if (posts.length === 0) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="text-center py-12">
          <ShineBorder
            className="rounded-xl inline-block w-full max-w-md"
            borderWidth={1}
          >
            <Card className="p-8 text-muted-foreground bg-transparent border-0">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg text-foreground">
                Próximamente artículos sobre {getTypeLabel(type).toLowerCase()}.
              </p>
            </Card>
          </ShineBorder>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <ShineBorder
            key={post.id}
            className="rounded-xl w-full"
            borderWidth={1}
          >
            <Card className="overflow-hidden bg-transparent border-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              {post.heroImageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.heroImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{getTypeLabel(post.type)}</Badge>
                  {post.publishedAt && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.publishedAt)}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-foreground">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto">
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
              </div>
            </Card>
          </ShineBorder>
        ))}
      </div>

      {/* View All Blog Posts Button */}
      <div className="text-center mt-12">
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/blog">Ver todos los artículos</Link>
        </Button>
      </div>
    </section>
  );
}
