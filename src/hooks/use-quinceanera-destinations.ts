import { useQuery } from "@tanstack/react-query";

interface QuinceaneraDestination {
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

interface QuinceaneraDestinationsResponse {
  items: QuinceaneraDestination[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchQuinceaneraDestinations(): Promise<
  QuinceaneraDestination[]
> {
  const res = await fetch("/api/quinceanera-destinations");
  if (!res.ok) {
    throw new Error("Failed to fetch quinceanera destinations");
  }
  return res.json();
}

export function useQuinceaneraDestinations() {
  return useQuery({
    queryKey: ["quinceanera-destinations"],
    queryFn: fetchQuinceaneraDestinations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedQuinceaneraDestinations() {
  return useQuery({
    queryKey: ["quinceanera-destinations", "featured"],
    queryFn: async () => {
      const destinations = await fetchQuinceaneraDestinations();
      return destinations.filter((dest) => dest.isFeatured);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
