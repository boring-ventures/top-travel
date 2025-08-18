import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { isValidImageUrl } from "@/lib/utils";

interface Department {
  id: string;
  type: string;
  title: string;
  heroImageUrl?: string;
  themeJson?: any;
}

interface DepartmentsProps {
  departments: Department[];
}

export default function Departments({ departments }: DepartmentsProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <AnimatedShinyText>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Departamentos
            </h2>
          </AnimatedShinyText>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Experiencias temáticas
          </p>
        </div>
      </div>

      {departments.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          Pronto publicaremos departamentos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {departments.map((dep) => (
            <Card
              key={dep.id}
              className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link
                href={dep.type === "WEDDINGS" ? "/weddings" : "/quinceanera"}
                className="block"
              >
                <div className="relative h-28 sm:h-32 md:h-36 lg:h-40 w-full">
                  {dep.heroImageUrl && isValidImageUrl(dep.heroImageUrl) ? (
                    <Image
                      src={dep.heroImageUrl}
                      alt={dep.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <div className="font-medium text-sm sm:text-base">
                    {dep.type === "WEDDINGS"
                      ? "Bodas de destino"
                      : "Quinceañera"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {dep.title}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
