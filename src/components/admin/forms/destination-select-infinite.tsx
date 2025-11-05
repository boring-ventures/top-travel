"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Destination {
  id: string;
  city: string;
  country: string;
}

interface DestinationSelectInfiniteProps {
  value?: string;
  onChange: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DestinationSelectInfinite({
  value,
  onChange,
  open: controlledOpen,
  onOpenChange,
}: DestinationSelectInfiniteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const fetchDestinations = useCallback(
    async (pageNum: number) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          pageSize: "20",
        });

        const response = await fetch(`/api/destinations?${params}`);
        const data = await response.json();

        if (pageNum === 1) {
          setDestinations(data.items || []);
        } else {
          setDestinations((prev) => [...prev, ...(data.items || [])]);
        }

        setHasMore(
          data.items &&
            data.items.length > 0 &&
            destinations.length + data.items.length < data.total
        );
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, destinations.length]
  );

  // Reset and fetch when opening the popover
  useEffect(() => {
    if (isOpen && destinations.length === 0) {
      setPage(1);
      setSearchQuery("");
      fetchDestinations(1);
    }
  }, [isOpen, destinations.length, fetchDestinations]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when scrolled 80% down
    if (scrollPercentage > 0.8) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDestinations(nextPage);
    }
  }, [loading, hasMore, page, fetchDestinations]);

  const selectedDestination = destinations.find((d) => d.id === value);

  const filteredDestinations = searchQuery
    ? destinations.filter((dest) =>
        `${dest.city} ${dest.country}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : destinations;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {selectedDestination
            ? `${selectedDestination.city}, ${selectedDestination.country}`
            : "Seleccionar destino..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Buscar destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Scrollable List */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-[300px] overflow-y-auto overflow-x-hidden"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {filteredDestinations.length === 0 && !loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? "No se encontraron destinos con ese nombre."
                  : "No se encontraron destinos."}
              </div>
            ) : (
              <>
                {filteredDestinations.map((destination) => (
                  <button
                    key={destination.id}
                    onClick={() => {
                      onChange(destination.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                      value === destination.id && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === destination.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {destination.city}, {destination.country}
                  </button>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Cargando...
                    </span>
                  </div>
                )}

                {/* End of list indicator */}
                {!hasMore && destinations.length > 0 && !loading && (
                  <div className="py-3 text-center">
                    <span className="text-xs text-muted-foreground">
                      {filteredDestinations.length === destinations.length
                        ? "Todos los destinos cargados"
                        : `Mostrando ${filteredDestinations.length} de ${destinations.length} destinos`}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
