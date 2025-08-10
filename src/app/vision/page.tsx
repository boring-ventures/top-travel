import prisma from "@/lib/prisma";

export default async function VisionPage() {
  const page = await prisma.page.findUnique({ where: { slug: "vision" } });
  const fallback = (
    <p>
      "Ser la agencia líder en Bolivia, reconocida por innovación y nuestra red
      de oficinas en Santa Cruz, Cochabamba y La Paz. Socio preferido para
      experiencias únicas: eventos, quinceañeras, bodas de destino y destinos
      exóticos."
    </p>
  );
  const content = page && page.status === "PUBLISHED" && page.sectionsJson;

  return (
    <div className="container mx-auto py-10 space-y-4 max-w-3xl">
      <h1 className="text-3xl font-semibold">Visión</h1>
      {content ? (
        <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
          {JSON.stringify(page?.sectionsJson, null, 2)}
        </pre>
      ) : (
        fallback
      )}
    </div>
  );
}
