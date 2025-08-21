import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackGradient?: string;
  priority?: boolean;
}

export function HeroImage({
  src,
  alt,
  className,
  fallbackGradient = "bg-gradient-to-br from-gray-600 to-gray-800",
  priority = false,
}: HeroImageProps) {
  if (!src) {
    return <div className={cn(fallbackGradient, "w-full h-full", className)} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className={cn("object-cover", className)}
      priority={priority}
    />
  );
}

