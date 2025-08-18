import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { isValidImageUrl } from "@/lib/utils";
import PromotionalCard from "./PromotionalCard";

interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  bannerImageUrl?: string;
  displayTag?: string;
  externalUrl?: string;
  package?: {
    slug?: string;
    title?: string;
    fromPrice?: number;
    currency?: string;
    summary?: string;
  };
}

interface FeaturedOffersProps {
  offers: Offer[];
  whatsappTemplate?: {
    templateBody: string;
    phoneNumber?: string;
  };
}

export default function FeaturedOffers({
  offers,
  whatsappTemplate,
}: FeaturedOffersProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Ofertas destacadas
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Promociones seleccionadas del mes
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="ml-auto sm:inline-flex hidden hover:bg-accent text-sm"
        >
          <Link href="/packages">Ver todas</Link>
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No hay ofertas destacadas por el momento.
        </div>
      ) : (
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex items-stretch p-2 sm:p-4 gap-3 sm:gap-4">
            {offers.map((o) => {
              const href = o.package?.slug
                ? `/packages/${o.package.slug}`
                : o.externalUrl || "#";
              const description =
                o.subtitle ||
                o.package?.summary ||
                "Descubre esta increíble oferta";

              return (
                <div key={o.id} className="w-72 sm:w-80 flex-shrink-0">
                  <PromotionalCard
                    id={o.id}
                    title={o.title}
                    subtitle={o.subtitle || ""}
                    description={description}
                    imageUrl={
                      o.bannerImageUrl && isValidImageUrl(o.bannerImageUrl)
                        ? o.bannerImageUrl
                        : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
                    }
                    href={href}
                    location="Bolivia"
                    resortName="GabyTop Travel"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
