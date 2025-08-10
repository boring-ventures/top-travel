import { Star } from "lucide-react";

type TestimonialItem = {
  id: string;
  authorName: string;
  location?: string | null;
  rating: number;
  content: string;
};

export default function Testimonials({ items }: { items: TestimonialItem[] }) {
  const list = items.filter((t) => t.rating > 0).slice(0, 6);

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Opiniones de nuestros clientes
        </h2>
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Pronto publicaremos testimonios.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {list.map((t, idx) => (
              <div
                key={t.id}
                className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex mb-4" aria-label={`${t.rating} estrellas`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={`${t.id}-star-${i}`}
                      className="h-5 w-5 text-primary fill-current"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4">&quot;{t.content}&quot;</p>
                <p className="text-primary font-semibold">
                  {t.authorName}
                  {t.location ? (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      • {t.location}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
