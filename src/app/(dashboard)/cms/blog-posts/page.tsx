import { BlogPostsTable } from "@/components/admin/cms/blog-posts";

export default function BlogPostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-muted-foreground">
          Gestiona los posts del blog para bodas y quinceañeras
        </p>
      </div>
      <BlogPostsTable />
    </div>
  );
}
