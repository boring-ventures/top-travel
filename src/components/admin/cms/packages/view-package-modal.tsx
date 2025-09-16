"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Eye,
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  Image,
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";

interface ViewPackageModalProps {
  packageSlug: string;
}

export function ViewPackageModal({ packageSlug }: ViewPackageModalProps) {
  const [open, setOpen] = useState(false);
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && packageSlug) {
      setLoading(true);
      setError(null);
      fetch(`/api/packages/${packageSlug}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setPackageData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch package for view:", error);
          setError(`Error al cargar el paquete: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, packageSlug]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setPackageData(null);
      setError(null);
    }
  };

  const handleDownloadPdf = async (pdfUrl: string, packageTitle: string) => {
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="sm"
        title="Ver paquete"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Detalles del Paquete
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando paquete...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">{error}</div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          ) : packageData ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{packageData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Slug: {packageData.slug}
                  </p>
                </div>

                {packageData.summary && (
                  <p className="text-sm text-gray-600">{packageData.summary}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <StatusBadge status={packageData.status} />
                  </div>
                  {packageData.isCustom && (
                    <Badge variant="secondary">Personalizado</Badge>
                  )}
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packageData.durationDays && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Duración</p>
                      <p className="text-sm text-gray-600">
                        {packageData.durationDays} días
                      </p>
                    </div>
                  </div>
                )}

                {packageData.fromPrice && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Precio desde</p>
                      <p className="text-sm text-gray-600">
                        {packageData.currency} {packageData.fromPrice}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hero Image */}
              {packageData.heroImageUrl && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Imagen Principal
                  </div>
                  <div className="relative">
                    <img
                      src={packageData.heroImageUrl}
                      alt={packageData.title}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.nextElementSibling?.classList.add("hidden");
                      }}
                    />
                    <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                      <div className="text-center">
                        <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div>Cargando imagen...</div>
                      </div>
                    </div>
                    <div className="hidden w-full h-48 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                      <div className="text-center">
                        <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div>Error al cargar la imagen</div>
                        <div className="text-xs mt-1 break-all">
                          {packageData.heroImageUrl}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Document */}
              {packageData.pdfUrl && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documento PDF
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Documento del paquete
                      </p>
                      <p className="text-xs text-gray-500">Archivo PDF</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(packageData.pdfUrl, "_blank")
                        }
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ver PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownloadPdf(
                            packageData.pdfUrl,
                            packageData.title
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packageData.inclusions &&
                  packageData.inclusions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Incluye:</h4>
                      <ul className="space-y-1 text-sm">
                        {packageData.inclusions.map(
                          (item: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {packageData.exclusions &&
                  packageData.exclusions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">No incluye:</h4>
                      <ul className="space-y-1 text-sm">
                        {packageData.exclusions.map(
                          (item: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Destinations & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packageData.packageDestinations &&
                  packageData.packageDestinations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Destinos:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {packageData.packageDestinations.map((pd: any) => (
                          <Badge key={pd.destination.id} variant="outline">
                            {pd.destination.city}, {pd.destination.country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {packageData.packageTags &&
                  packageData.packageTags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Etiquetas:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {packageData.packageTags.map((pt: any) => (
                          <Badge key={pt.tag.id} variant="secondary">
                            {pt.tag.name} ({pt.tag.type})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t text-xs text-gray-500">
                <p>
                  Creado: {new Date(packageData.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Actualizado:{" "}
                  {new Date(packageData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-red-600 mb-2">
                Error al cargar los datos del paquete.
              </div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
