"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Tag, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

// Custom hook to fetch tags
const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await fetch("/api/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      return res.json();
    },
  });
};

export function TagsInput({
  value = [],
  onChange,
  label = "Etiquetas",
  placeholder = "Seleccionar etiquetas...",
  className,
}: TagsInputProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tags, isLoading: tagsLoading } = useTags();

  const handleSelect = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  const handleRemove = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  const selectedTags = tags?.filter((tag: any) => value.includes(tag.id)) || [];

  // Filter tags based on search term
  const filteredTags =
    tags?.filter((tag: any) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="text-sm">
                {selectedTags.length > 0
                  ? `${selectedTags.length} etiqueta${
                      selectedTags.length === 1 ? "" : "s"
                    } seleccionada${selectedTags.length === 1 ? "" : "s"}`
                  : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {tagsLoading ? (
              <div className="p-2 text-sm text-muted-foreground">
                Cargando etiquetas...
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                No se encontraron etiquetas.
              </div>
            ) : (
              <div className="p-1">
                {filteredTags.map((tag: any) => (
                  <div
                    key={tag.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent",
                      value.includes(tag.id) && "bg-accent"
                    )}
                    onClick={() => handleSelect(tag.id)}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value.includes(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {tag.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag: any) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(tag.id)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
