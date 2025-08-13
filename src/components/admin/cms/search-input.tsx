"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

type SearchInputProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
  initialValue?: string;
};

export const SearchInput = ({ placeholder = "Search...", onSearch, initialValue = "" }: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);
  // reuse debounce hook infra, though name is mobile, it exposes a stable timeout pattern
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="max-w-xs">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};


