import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface InclusionsExclusionsProps {
  inclusions?: string[];
  exclusions?: string[];
  className?: string;
}

export function InclusionsExclusions({
  inclusions,
  exclusions,
  className,
}: InclusionsExclusionsProps) {
  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Inclusions */}
      {inclusions && inclusions.length > 0 && (
        <Card className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Incluye
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inclusions.map((inc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
              >
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">{inc}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Exclusions */}
      {exclusions && exclusions.length > 0 && (
        <Card className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            No incluye
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exclusions.map((exc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
              >
                <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-sm">{exc}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
