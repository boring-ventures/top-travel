import { useQuery } from "@tanstack/react-query";

interface WeddingDestination {
  id: string;
  slug: string;
  name: string;
  title: string;
  description?: string;
  heroImageUrl?: string;
  gallery?: any;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WeddingDestinationsResponse {
  items: WeddingDestination[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchWeddingDestinations(): Promise<WeddingDestination[]> {
  const res = await fetch("/api/wedding-destinations");
  if (!res.ok) {
    throw new Error("Failed to fetch wedding destinations");
  }
  return res.json();
}

export function useWeddingDestinations() {
  return useQuery({
    queryKey: ["wedding-destinations"],
    queryFn: fetchWeddingDestinations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedWeddingDestinations() {
  return useQuery({
    queryKey: ["wedding-destinations", "featured"],
    queryFn: async () => {
      const destinations = await fetchWeddingDestinations();
      return destinations.filter((dest) => dest.isFeatured);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
