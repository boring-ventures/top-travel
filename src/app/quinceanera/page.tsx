import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function QuinceaneraPage() {
  const dept = await prisma.department.findUnique({
    where: { type: "QUINCEANERA" },
  });

  const primary = (dept?.themeJson as any)?.primaryColor ?? "#ff7ab6";
  const accent = (dept?.themeJson as any)?.accentColor ?? "#ffd1e6";
  const hero = dept?.heroImageUrl;

  return (
    <div className="min-h-screen">
      <section
        className="relative py-20"
        style={{
          background: `linear-gradient(135deg, ${primary}22, ${accent}22)`,
        }}
      >
        <div className="container mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-semibold"
            style={{ color: primary }}
          >
            {dept?.title ?? "Quinceañera Tours"}
          </h1>
          {dept?.intro && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{dept.intro}</p>
          )}
        </div>
        {hero && (
          <Image
            src={hero}
            alt="Quinceañera hero"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover opacity-20"
          />
        )}
      </section>

      <section className="container mx-auto py-12">
        <h2 className="text-xl font-semibold mb-4">Highlights</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <li className="rounded border p-4">Safe and supervised activities</li>
          <li className="rounded border p-4">Memorable photo experiences</li>
          <li className="rounded border p-4">Fun itineraries for teens</li>
        </ul>
      </section>
    </div>
  );
}
