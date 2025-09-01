"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BlogPost } from "@prisma/client";
import {
  useBlogPosts,
  useDeleteBlogPost,
  useBlogPost,
} from "@/hooks/use-blog-posts";
import { EditBlogPostModal } from "./edit-blog-post-modal";
import { DeleteBlogPostDialog } from "./delete-blog-post-dialog";
import { CreateBlogPostModal } from "./create-blog-post-modal";

export function BlogPostsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const { data: blogPostsData, isLoading } = useBlogPosts();
  const { data: editingPost } = useBlogPost(editingPostId || "");
  const deletePostMutation = useDeleteBlogPost();

  const posts = blogPostsData?.posts || [];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (post: BlogPost) => {
    try {
      await deletePostMutation.mutateAsync(post.id);
      toast({
        title: "Post eliminado",
        description: "El blog post ha sido eliminado exitosamente.",
      });
      setDeletingPost(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el blog post.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando blog posts...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts</CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Post
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-muted-foreground">
                          {post.excerpt}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{post.author || "Sin autor"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {post.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {post.type === "WEDDINGS" ? "Bodas" : "Quinceañeras"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingPostId(post.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingPost(post)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateBlogPostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false);
        }}
      />

      {editingPost && editingPostId && (
        <EditBlogPostModal
          post={editingPost}
          open={!!editingPostId}
          onOpenChange={(open) => !open && setEditingPostId(null)}
          onSuccess={() => {
            setEditingPostId(null);
          }}
        />
      )}

      {deletingPost && (
        <DeleteBlogPostDialog
          post={deletingPost}
          open={!!deletingPost}
          onOpenChange={(open) => !open && setDeletingPost(null)}
          onConfirm={() => handleDelete(deletingPost)}
        />
      )}
    </>
  );
}
