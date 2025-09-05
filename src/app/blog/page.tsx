"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen, Sparkles, PenTool } from "lucide-react";
import { usePublishedBlogPosts } from "@/hooks/use-blog-posts";
import { DepartmentType } from "@prisma/client";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { AnimatedText } from "@/components/ui/animated-text";

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
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        <Header />
        <main className="flex-grow relative pt-20">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <div className="animate-pulse">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-4xl font-bold mb-4">Cargando blog...</h1>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative pt-20">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Blog Posts Section */}
        <section className="py-12 w-full bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Consejos y <span className="font-light italic">Tendencias</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Inspírate con nuestros artículos especializados en bodas, quinceañeras y eventos únicos
              </p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-2 shadow-lg">
                <div className="flex space-x-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={selectedType === "ALL" ? "default" : "ghost"}
                      onClick={() => setSelectedType("ALL")}
                      className={`px-8 py-3 rounded-xl transition-all duration-200 ${
                        selectedType === "ALL" 
                          ? "bg-black text-white shadow-lg" 
                          : "hover:bg-gray-100/50 text-gray-700"
                      }`}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Todos
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={
                        selectedType === DepartmentType.WEDDINGS ? "default" : "ghost"
                      }
                      onClick={() => setSelectedType(DepartmentType.WEDDINGS)}
                      className={`px-8 py-3 rounded-xl transition-all duration-200 ${
                        selectedType === DepartmentType.WEDDINGS 
                          ? "bg-black text-white shadow-lg" 
                          : "hover:bg-gray-100/50 text-gray-700"
                      }`}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Bodas
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={
                        selectedType === DepartmentType.QUINCEANERA ? "default" : "ghost"
                      }
                      onClick={() => setSelectedType(DepartmentType.QUINCEANERA)}
                      className={`px-8 py-3 rounded-xl transition-all duration-200 ${
                        selectedType === DepartmentType.QUINCEANERA 
                          ? "bg-black text-white shadow-lg" 
                          : "hover:bg-gray-100/50 text-gray-700"
                      }`}
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Quinceañeras
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Blog Posts Grid */}
            {posts.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                  <BookOpen className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    No hay posts disponibles
                  </h3>
                  <p className="text-gray-600">
                    {selectedType === "ALL"
                      ? "Aún no hemos publicado ningún post en el blog."
                      : `No hay posts publicados para ${getTypeLabel(selectedType).toLowerCase()}.`}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {posts.map((post, index) => (
                  <motion.div 
                    key={post.id} 
                    className="relative overflow-hidden rounded-2xl group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.1 * index,
                      ease: "easeOut" 
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <div className="relative h-80 sm:h-96">
                      <Image
                        src={post.heroImageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      
                      {/* Top Glass Content */}
                      <div className="absolute top-0 left-0 right-0 p-6">
                        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-block">
                          <p className="text-white text-sm font-medium">{getTypeLabel(post.type)}</p>
                        </div>
                        {post.publishedAt && (
                          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <div className="flex items-center text-xs text-white">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(post.publishedAt)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom Glass Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="space-y-4">
                          <h2 className="text-white text-2xl font-bold font-serif drop-shadow-lg line-clamp-2">
                            {post.title}
                          </h2>
                          
                          {post.excerpt && (
                            <p className="text-white/90 text-sm drop-shadow-lg line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          
                          <Button
                            asChild
                            className="w-full bg-black/30 backdrop-blur-md hover:bg-black/40 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
                          >
                            <Link href={`/blog/${post.slug}`}>
                              <span>Leer más</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
