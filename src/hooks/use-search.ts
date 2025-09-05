"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./use-debounce";

interface SearchResult {
  type: "package" | "destination" | "event" | "fixed-departure";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
  destinations?: any[];
  tags?: any[];
  startDate?: string;
  endDate?: string;
  destination?: any;
}

interface SearchResponse {
  results: SearchResult[];
}

const searchApi = async (query: string): Promise<SearchResponse> => {
  if (!query || query.length < 2) {
    return { results: [] };
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Search failed");
  }
  return response.json();
};

export const useSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 500); // Increased debounce time

  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchApi(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes - search results don't change often
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1, // Only retry once for search
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};
