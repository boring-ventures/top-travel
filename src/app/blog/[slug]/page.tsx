"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold mb-4">Cargando post...</h1>
        </motion.div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold mb-4">Post no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El post que buscas no existe o no está disponible.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al blog
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Article Header */}
      <motion.article 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Hero Image */}
        {post.heroImageUrl && (
          <motion.div 
            className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Image
              src={post.heroImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Meta Information */}
        <motion.div 
          className="flex flex-wrap items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
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
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          {post.title}
        </motion.h1>

        {/* Excerpt */}
        {post.excerpt && (
          <motion.div 
            className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            {post.excerpt}
          </motion.div>
        )}

        {/* Content */}
        <motion.div 
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
        >
          {formatContent(post.content)}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-12 pt-8 border-t"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Publicado el {formatDate(post.publishedAt)}
              {post.author && ` por ${post.author}`}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/blog">
                <Button variant="outline">Ver más posts</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}


