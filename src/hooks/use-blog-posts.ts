import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost, DepartmentType, ContentStatus } from "@prisma/client";
import {
  BlogPostInput,
  BlogPostUpdateInput,
  BlogPostFilter,
} from "@/lib/validations/blog-post";

// Types
interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API functions
const fetchBlogPosts = async (
  filters: BlogPostFilter
): Promise<BlogPostsResponse> => {
  const params = new URLSearchParams();

  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  params.set("page", filters.page.toString());
  params.set("limit", filters.limit.toString());

  const response = await fetch(`/api/blog-posts?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  return response.json();
};

const fetchBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await fetch(`/api/blog-posts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }
  return response.json();
};

const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await fetch(`/api/blog-posts/slug/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }
  return response.json();
};

const createBlogPost = async (data: BlogPostInput): Promise<BlogPost> => {
  const response = await fetch("/api/blog-posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create blog post");
  }
  return response.json();
};

const updateBlogPost = async ({
  id,
  ...data
}: BlogPostUpdateInput): Promise<BlogPost> => {
  const response = await fetch(`/api/blog-posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update blog post");
  }
  return response.json();
};

const deleteBlogPost = async (id: string): Promise<void> => {
  const response = await fetch(`/api/blog-posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete blog post");
  }
};

// Hooks
export const useBlogPosts = (
  filters: BlogPostFilter = { page: 1, limit: 10 }
) => {
  return useQuery({
    queryKey: ["blog-posts", filters],
    queryFn: () => fetchBlogPosts(filters),
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => fetchBlogPost(id),
    enabled: !!id,
  });
};

export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post-slug", slug],
    queryFn: () => fetchBlogPostBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlogPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.setQueryData(["blog-post", data.id], data);
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};

// Utility hooks for filtered data
export const useWeddingBlogPosts = (
  filters: Omit<BlogPostFilter, "type"> = {}
) => {
  return useBlogPosts({ ...filters, type: DepartmentType.WEDDINGS });
};

export const useQuinceaneraBlogPosts = (
  filters: Omit<BlogPostFilter, "type"> = {}
) => {
  return useBlogPosts({ ...filters, type: DepartmentType.QUINCEANERA });
};

export const usePublishedBlogPosts = (
  filters: Omit<BlogPostFilter, "status"> = {}
) => {
  return useBlogPosts({ ...filters, status: ContentStatus.PUBLISHED });
};


