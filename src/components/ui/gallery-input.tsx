"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryInputProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  onFileSelect?: (files: File[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxImages?: number;
  aspectRatio?: number; // width/height
  deferred?: boolean;
}

export function GalleryInput({
  value = [],
  onChange,
  onUpload,
  onFileSelect,
  placeholder = "Upload gallery images",
  className,
  disabled = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  maxImages = 10,
  aspectRatio,
  deferred = false,
}: GalleryInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate number of images
    if (value.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(`Please select valid image files only`);
        return;
      }
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }
      validFiles.push(file);
    }

    setError(null);
    setSelectedFiles(validFiles);

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    if (deferred) {
      // For deferred uploads, just notify parent component
      onFileSelect?.(validFiles);
    } else {
      // For immediate uploads, upload right away
      setIsUploading(true);
      try {
        const uploadedUrls = await onUpload!(validFiles);
        onChange([...value, ...uploadedUrls]);
        setPreviews([]);
        setSelectedFiles([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreviews([]);
        setSelectedFiles([]);
      } finally {
        setIsUploading(false);
      }
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleRemovePreview = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setSelectedFiles(newFiles);
    onFileSelect?.(newFiles);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const allImages = [...value, ...previews];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="gallery-upload">{placeholder}</Label>
        <div className="text-sm text-muted-foreground">
          {value.length} / {maxImages} images
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Add Image Button */}
        {value.length < maxImages && (
          <Card
            className={cn(
              "border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleClick}
          >
            <div className="space-y-2">
              <Plus className="mx-auto h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Click to add images</span>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to {maxSize}MB each
              </p>
            </div>
          </Card>
        )}

        {/* Gallery Grid */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {allImages.map((image, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div
                  className={cn(
                    "relative",
                    aspectRatio ? `aspect-[${aspectRatio}]` : "aspect-square"
                  )}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => {
                      if (index < value.length) {
                        handleRemove(index);
                      } else {
                        handleRemovePreview(index - value.length);
                      }
                    }}
                    disabled={disabled || isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index >= value.length && (
                    <Badge
                      variant="secondary"
                      className="absolute bottom-1 left-1 text-xs"
                    >
                      New
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isUploading && (
          <div className="flex items-center space-x-2 text-sm text-corporate-blue">
            <Upload className="h-4 w-4 animate-pulse" />
            <span>Uploading images...</span>
          </div>
        )}

        {deferred && selectedFiles.length > 0 && !isUploading && (
          <div className="flex items-center space-x-2 text-sm text-corporate-blue">
            <ImageIcon className="h-4 w-4" />
            <span>
              {selectedFiles.length} images selected - will upload when form is
              submitted
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
