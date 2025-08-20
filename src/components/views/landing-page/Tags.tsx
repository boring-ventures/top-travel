import Link from "next/link";
import TagCloud from "./TagCloud";

interface TagsProps {
  tags: any[];
  className?: string;
}

export default function Tags({ tags, className = "" }: TagsProps) {
  if (!tags.length) return null;

  return (
    <section
      className={`py-16 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explorar por Etiquetas</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre contenido organizado por categorías. Haz clic en cualquier
            etiqueta para ver todo el contenido relacionado.
          </p>
        </div>
        <TagCloud
          tags={tags}
          showCounts={true}
          maxTags={12}
          className="justify-center"
        />
        <div className="text-center mt-8">
          <a
            href="/tags"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Ver todas las etiquetas
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}


