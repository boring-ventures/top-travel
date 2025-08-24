import { Metadata } from "next";
import { BlogPostsTable } from "@/components/admin/cms/blog-posts";

export const metadata: Metadata = {
  title: "Blog Posts | CMS",
  description: "Gestiona los posts del blog para bodas y quinceañeras",
};

export default function BlogPostsPage() {
  return (
    <div className="flex flex-col gap-6">
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
