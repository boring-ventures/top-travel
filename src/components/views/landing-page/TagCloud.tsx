import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tag, MapPin, Package } from "lucide-react";

interface TagCloudProps {
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
    _count?: {
      packageTags: number;
      destinationTags: number;
    };
  }>;
  showCounts?: boolean;
  maxTags?: number;
  className?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "REGION":
      return <MapPin className="h-3 w-3" />;
    case "THEME":
      return <Tag className="h-3 w-3" />;
    case "DEPARTMENT":
      return <Package className="h-3 w-3" />;
    default:
      return <Tag className="h-3 w-3" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "REGION":
      return "bg-blue-lighter text-corporate-blue hover:bg-blue-light";
    case "THEME":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "DEPARTMENT":
      return "bg-red-lighter text-corporate-red hover:bg-red-light";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export default function TagCloud({
  tags,
  showCounts = false,
  maxTags = 12,
  className = "",
}: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => (
        <Link key={tag.id} href={`/tags/${tag.slug}`} className="inline-block">
          <Badge
            variant="outline"
            className={`text-xs transition-colors cursor-pointer flex items-center gap-1 ${getTypeColor(tag.type)}`}
          >
            {getTypeIcon(tag.type)}
            <span>{tag.name}</span>
            {showCounts && tag._count && (
              <span className="text-xs opacity-75">
                ({tag._count.packageTags + tag._count.destinationTags})
              </span>
            )}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
