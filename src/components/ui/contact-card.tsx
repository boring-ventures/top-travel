import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";
import WhatsAppCTA from "@/components/utils/whatsapp-cta";

interface ContactCardProps {
  title: string;
  description: string;
  whatsappProps: {
    label: string;
    template: string;
    variables: Record<string, string>;
    campaign: string;
    content: string;
  };
  showShareButton?: boolean;
  showSaveButton?: boolean;
  className?: string;
}

export function ContactCard({
  title,
  description,
  whatsappProps,
  showShareButton = true,
  showSaveButton = true,
  className,
}: ContactCardProps) {
  return (
    <Card className={`p-6 ${className || ""}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <WhatsAppCTA
          label={whatsappProps.label}
          template={whatsappProps.template}
          variables={whatsappProps.variables}
          campaign={whatsappProps.campaign}
          content={whatsappProps.content}
          size="lg"
          className="w-full"
        />

        {(showShareButton || showSaveButton) && (
          <div className="flex gap-2">
            {showSaveButton && (
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            )}
            {showShareButton && (
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

