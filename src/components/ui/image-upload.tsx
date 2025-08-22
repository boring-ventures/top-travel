"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>; // Made optional for deferred uploads
  onFileSelect?: (file: File) => void; // New prop for deferred uploads
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  aspectRatio?: number; // width/height
  deferred?: boolean; // New prop to enable deferred uploads
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  onFileSelect,
  placeholder = "Upload an image",
  className,
  disabled = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  aspectRatio,
  deferred = false, // Default to immediate upload for backward compatibility
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use value prop as the display image (for existing images)
  const displayImage = preview || value;

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    if (deferred) {
      // For deferred uploads, just notify parent component
      onFileSelect?.(file);
      // Don't call onChange yet - wait for form submission
    } else {
      // For immediate uploads, upload right away
      setIsUploading(true);
      try {
        console.log("ImageUpload: Starting upload for file:", file.name);
        const uploadedUrl = await onUpload!(file);
        console.log(
          "ImageUpload: Upload completed, received URL:",
          uploadedUrl
        );
        onChange(uploadedUrl);
      } catch (err) {
        console.error("ImageUpload: Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreview(null);
        setSelectedFile(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (!deferred) {
      onChange("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Method to get the selected file (for deferred uploads)
  const getSelectedFile = () => selectedFile;

  // Expose the method via ref or callback
  React.useImperativeHandle(
    React.useRef(),
    () => ({
      getSelectedFile,
    }),
    [selectedFile]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="image-upload">{placeholder}</Label>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {displayImage ? (
          <Card className="relative overflow-hidden">
            <div
              className={cn(
                "relative",
                aspectRatio ? `aspect-[${aspectRatio}]` : "aspect-video"
              )}
            >
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card
            className={cn(
              "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleClick}
          >
            <div className="space-y-2">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
          </Card>
        )}

        {/* Show upload area when there's an existing image */}
        {displayImage && (
          <Card
            className={cn(
              "border-2 border-dashed border-corporate-blue rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-blue-dark bg-blue-lighter",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleClick}
          >
            <div className="space-y-1">
              <ImageIcon className="mx-auto h-8 w-8 text-corporate-blue" />
              <div className="text-sm text-corporate-blue">
                <span className="font-medium">Click to replace image</span>
              </div>
              <p className="text-xs text-corporate-blue">
                Select a new image to replace the current one
              </p>
            </div>
          </Card>
        )}

        {error && <p className="text-sm text-corporate-red">{error}</p>}

        {isUploading && (
          <div className="flex items-center space-x-2 text-sm text-corporate-blue">
            <Upload className="h-4 w-4 animate-pulse" />
            <span>Uploading...</span>
          </div>
        )}

        {deferred && selectedFile && !isUploading && (
          <div className="flex items-center space-x-2 text-sm text-corporate-blue">
            <ImageIcon className="h-4 w-4" />
            <span>Image selected - will upload when form is submitted</span>
          </div>
        )}
      </div>
    </div>
  );
}
