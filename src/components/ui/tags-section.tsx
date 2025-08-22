import Link from "next/link";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagsSectionProps {
  title: string;
  tags: Tag[];
  variant?: "default" | "rounded" | "compact";
  className?: string;
}

export function TagsSection({
  title,
  tags,
  variant = "default",
  className,
}: TagsSectionProps) {
  const getTagClasses = () => {
    switch (variant) {
      case "rounded":
        return "rounded-full border px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer bg-background/80 backdrop-blur-sm";
      case "compact":
        return "rounded border px-2 py-1 text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer";
      default:
        return "rounded-lg border px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer";
    }
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className={getTagClasses()}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

