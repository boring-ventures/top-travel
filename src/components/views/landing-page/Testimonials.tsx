"use client";

import { Star, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TestimonialItem = {
  id: string;
  authorName: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  location?: string;
};

type TestimonialsProps = {
  items: TestimonialItem[];
};

export default function Testimonials({ items }: TestimonialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current || items.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    const scrollSpeed = 1; // pixels per frame
    let animationId: number;

    const autoScroll = () => {
      if (isHovered) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }

      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        // Reset to beginning when reaching the end
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered, items.length]);

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-secondary/10 to-background">
      <div
        className="container mx-auto"
        style={{ paddingLeft: "12vw", paddingRight: "12vw" }}
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-foreground text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4">
            Testimonios de Clientes
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Descubre lo que nuestros clientes dicen sobre sus experiencias con
            GabyTop Travel
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-stretch p-2 sm:p-4 gap-4 sm:gap-6">
            {duplicatedItems.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-80 sm:w-96 flex-shrink-0"
              >
                <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < (testimonial.rating || 5)
                              ? "text-yellow-400 fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-1">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div>
                      <p className="text-card-foreground font-semibold text-sm sm:text-base">
                        {testimonial.authorName}
                      </p>
                      {testimonial.location && (
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {testimonial.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
            ¿Listo para crear tu propia experiencia inolvidable?
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-sm sm:text-base">
            Contáctanos Hoy
          </button>
        </div>
      </div>
    </section>
  );
}
