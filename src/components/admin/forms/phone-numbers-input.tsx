"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Phone } from "lucide-react";

interface PhoneNumbersInputProps {
  value: string[];
  onChange: (phoneNumbers: string[]) => void;
  error?: string;
  placeholder?: string;
}

export function PhoneNumbersInput({
  value,
  onChange,
  error,
  placeholder = "Ej: +59171234567",
}: PhoneNumbersInputProps) {
  const [newPhone, setNewPhone] = useState("");

  const addPhoneNumber = () => {
    if (newPhone.trim() && !value.includes(newPhone.trim())) {
      onChange([...value, newPhone.trim()]);
      setNewPhone("");
    }
  };

  const removePhoneNumber = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPhoneNumber();
    }
  };

  return (
    <div className="space-y-3">
      <Label>Números de Teléfono *</Label>

      {/* Existing phone numbers */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((phone, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 p-2 border rounded-md bg-gray-50">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{phone}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePhoneNumber(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add new phone number */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          onKeyPress={handleKeyPress}
          className={error ? "border-red-500" : ""}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPhoneNumber}
          disabled={!newPhone.trim() || value.includes(newPhone.trim())}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && <p className="text-sm text-corporate-red">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Agrega múltiples números de WhatsApp. Se seleccionará uno aleatoriamente
        para cada mensaje.
        {value.length > 0 && (
          <span className="block mt-1">
            Números configurados: {value.length}
          </span>
        )}
      </p>
    </div>
  );
}
