"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  placeholder?: string;
  className?: string;
}

export function PdfUpload({
  value,
  onChange,
  onFileSelect,
  placeholder = "Subir PDF",
  className,
}: PdfUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setUploadError("Solo se permiten archivos PDF");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("El archivo no puede ser mayor a 10MB");
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    onFileSelect?.(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("bucket", "documents");
      formData.append("folder", "packages/temp"); // We'll update this with the actual package slug later

      // Upload to our server-side API
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      onChange(result.url);
      setSelectedFile(null);
    } catch (error) {
      console.error("PDF upload error:", error);
      setUploadError(
        error instanceof Error ? error.message : "Error al subir el archivo"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadError(null);
      onFileSelect?.(file);
    } else {
      setUploadError("Solo se permiten archivos PDF");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Documento PDF</Label>

      {value ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50 dark:bg-green-950">
          <Check className="h-4 w-4 text-green-600" />
          <FileText className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 dark:text-green-200">
            PDF subido correctamente
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="ml-auto h-6 w-6 p-0 text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            uploadError
              ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950"
              : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-3">
              <FileText className="h-8 w-8 mx-auto text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-3 w-3 mr-1 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3 mr-1" />
                      Subir PDF
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadError(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <FileText className="h-8 w-8 mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Arrastra un archivo PDF aquí o haz clic para seleccionar
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3 w-3 mr-1" />
                Seleccionar PDF
              </Button>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
      )}
    </div>
  );
}
