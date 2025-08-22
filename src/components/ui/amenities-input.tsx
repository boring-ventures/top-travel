"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AmenitiesInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function AmenitiesInput({
  label,
  value = [],
  onChange,
  placeholder = "Escribir y presionar Enter...",
  className,
}: AmenitiesInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>{label}</Label>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
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
