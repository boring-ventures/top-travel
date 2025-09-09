"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";

interface PackagePdfSectionProps {
  pdfUrl: string;
  packageTitle: string;
}

export function PackagePdfSection({
  pdfUrl,
  packageTitle,
}: PackagePdfSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${packageTitle}-documento.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Fallback to opening in new tab
      window.open(pdfUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border border-black/20 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black/80">
        <FileText className="h-5 w-5 text-red-600" />
        Documento del paquete
      </h3>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <FileText className="h-12 w-12 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-black/80 mb-1">
              Información detallada del paquete
            </h4>
            <p className="text-sm text-black/60 mb-3">
              Descarga el documento PDF con toda la información completa del
              paquete, incluyendo itinerarios detallados, precios y condiciones.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleView}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={isDownloading}
                className="border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isDownloading ? "Descargando..." : "Descargar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
