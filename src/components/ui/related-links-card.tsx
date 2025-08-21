import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface RelatedLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface RelatedLinksCardProps {
  title: string;
  links: RelatedLink[];
  className?: string;
}

export function RelatedLinksCard({
  title,
  links,
  className,
}: RelatedLinksCardProps) {
  return (
    <Card className={`p-6 ${className || ""}`}>
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="space-y-3">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Button
              key={index}
              asChild
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Link href={link.href}>
                <Icon className="h-4 w-4 mr-2" />
                {link.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}

