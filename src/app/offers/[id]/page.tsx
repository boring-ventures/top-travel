import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPriceWithCurrency } from "@/lib/currency-utils";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { PdfSection } from "@/components/ui/pdf-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ClientWhatsAppCTA } from "@/components/utils/client-whatsapp-cta";
import { getWhatsAppTemplateByUsage } from "@/lib/whatsapp-utils";

interface OfferPageProps {
  params: Promise<{ id: string }>;
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params;

  // Fetch WhatsApp template for offers
  const whatsappTemplate = await getWhatsAppTemplateByUsage("OFFERS");

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      package: {
        select: {
          id: true,
          title: true,
          slug: true,
          fromPrice: true,
          currency: true,
        },
      },
      offerTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!offer) {
    notFound();
  }

  const formatPrice = (offer: any) => {
    if (offer.package?.fromPrice) {
      return formatPriceWithCurrency(
        offer.package.fromPrice,
        offer.package.currency,
        true
      );
    }
    return "Consultar precio";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10" />

        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[60vh] min-h-[400px] sm:h-[70vh] lg:h-[80vh]">
            <Image
              src={
                offer.bannerImageUrl &&
                offer.bannerImageUrl !== "1" &&
                offer.bannerImageUrl !== "null"
                  ? offer.bannerImageUrl
                  : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
              }
              alt={offer.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Navigation */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link href="/offers" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Volver a ofertas</span>
                    <span className="sm:hidden">Volver</span>
                  </Link>
                </Button>

                {offer.isFeatured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 backdrop-blur-md">
                    <Star className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">DESTACADA</span>
                    <span className="sm:hidden">★</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                    {offer.title}
                  </h1>
                  {offer.subtitle && (
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl drop-shadow-lg">
                      {offer.subtitle}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                        {formatPrice(offer)}
                      </p>
                    </div>
                    {offer.package && (
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-md w-fit"
                      >
                        {offer.package.title}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 sm:py-12 lg:py-16 w-full bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  {/* Tags */}
                  {offer.offerTags && offer.offerTags.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                        Categorías
                      </h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {offer.offerTags.map((offerTag) => (
                          <Badge
                            key={offerTag.tag.id}
                            variant="outline"
                            className="text-sm px-3 py-1"
                          >
                            {offerTag.tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Package Link */}
                  {offer.package && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                        Paquete relacionado
                      </h3>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                      >
                        <Link
                          href={`/packages/${offer.package.slug}`}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver paquete: {offer.package.title}
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* External Link */}
                  {offer.externalUrl && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                        Enlace externo
                      </h3>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <a
                          href={offer.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visitar enlace
                        </a>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* PDF Section */}
                  {offer.pdfUrl && (
                    <div className="sticky top-6">
                      <PdfSection
                        pdfUrl={offer.pdfUrl}
                        title={offer.title}
                        documentType="oferta"
                        description="Descarga el documento PDF con toda la información completa de la oferta, incluyendo detalles, precios y condiciones especiales."
                      />
                    </div>
                  )}

                  {/* WhatsApp CTA */}
                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-xl p-6 shadow-sm">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-800">
                        ¿Tienes preguntas?
                      </h3>
                      <p className="text-green-700 mb-6 text-sm sm:text-base">
                        Contáctanos por WhatsApp para obtener más información
                        sobre esta oferta.
                      </p>
                      <ClientWhatsAppCTA
                        whatsappTemplate={
                          whatsappTemplate
                            ? {
                                templateBody: whatsappTemplate.templateBody,
                                phoneNumber: whatsappTemplate.phoneNumber,
                                phoneNumbers: whatsappTemplate.phoneNumbers,
                              }
                            : undefined
                        }
                        label="Consultar por WhatsApp"
                        template={
                          whatsappTemplate?.templateBody ||
                          `Hola! Me interesa la oferta "${offer.title}". ¿Podrían darme más información?`
                        }
                        variables={{
                          title: offer.title,
                          slug: offer.id,
                          itemTitle: offer.title,
                          subtitle: offer.subtitle || "",
                        }}
                        campaign="offer_detail"
                        content={offer.id}
                        size="default"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
