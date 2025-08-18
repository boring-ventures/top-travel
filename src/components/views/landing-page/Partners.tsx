"use client";

// Using native img for remote logos to avoid domain config issues
import { InfiniteSlider } from "@/components/magicui/infinite-slider";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";

const partnerLogos = [
  {
    name: "TripAdvisor",
    src: "https://cdn.worldvectorlogo.com/logos/tripadvisor-1.svg",
  },
  {
    name: "Booking.com",
    src: "https://logos-world.net/wp-content/uploads/2021/08/Booking-Logo.png",
  },
  {
    name: "Expedia",
    src: "https://logos-world.net/wp-content/uploads/2020/05/Expedia-Logo.png",
  },
  {
    name: "Airbnb",
    src: "https://logos-world.net/wp-content/uploads/2020/10/Airbnb-Logo.png",
  },
  {
    name: "Agoda",
    src: "https://logos-world.net/wp-content/uploads/2021/02/Agoda-Logo.png",
  },
];

export default function Partners() {
  return (
    <section className="bg-background py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="text-center mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Empresas que confían en nosotros
            </p>
          </div>
          <div className="relative">
            <InfiniteSlider speedOnHover={20} speed={40} gap={40}>
              {partnerLogos.map((logo) => (
                <div key={logo.name} className="flex justify-center">
                  <img
                    className="h-8 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
                    src={logo.src}
                    alt={`${logo.name} Logo`}
                    height={32}
                    width={100}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </InfiniteSlider>

            {/* Mobile blur effects */}
            <div
              className="absolute inset-y-0 left-0 w-6"
              style={{
                background:
                  "linear-gradient(to right, var(--background) 0%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-6"
              style={{
                background:
                  "linear-gradient(to left, var(--background) 0%, transparent 100%)",
              }}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-6"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-6"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center">
          <div className="max-w-44 border-r pr-6">
            <p className="text-end text-sm text-muted-foreground">
              Empresas que confían en nosotros
            </p>
          </div>
          <div className="relative flex-1 py-6 pl-6">
            <InfiniteSlider speedOnHover={20} speed={40} gap={80}>
              {partnerLogos.map((logo) => (
                <div key={logo.name} className="flex justify-center">
                  <img
                    className="h-8 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
                    src={logo.src}
                    alt={`${logo.name} Logo`}
                    height={32}
                    width={120}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </InfiniteSlider>

            {/* Desktop blur effects */}
            <div
              className="absolute inset-y-0 left-0 w-20"
              style={{
                background:
                  "linear-gradient(to right, var(--background) 0%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-20"
              style={{
                background:
                  "linear-gradient(to left, var(--background) 0%, transparent 100%)",
              }}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
