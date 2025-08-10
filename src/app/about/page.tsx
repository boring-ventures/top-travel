import prisma from "@/lib/prisma";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
  });

  const hasContent = page && page.status === "PUBLISHED" && page.sectionsJson;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Sobre GabyTop Travel</h1>
      {hasContent ? (
        <pre className="whitespace-pre-wrap text-sm bg-neutral-50 p-3 rounded border">
          {JSON.stringify(page?.sectionsJson, null, 2)}
        </pre>
      ) : (
        <div className="prose max-w-3xl">
          <p>
            GabyTop Travel SRL es tu agencia de viajes de confianza en Bolivia,
            con oficinas en Santa Cruz, Cochabamba y La Paz. Creamos
            experiencias memorables: desde conciertos y eventos exclusivos hasta
            destinos exóticos, viajes de quinceañera y bodas de destino.
          </p>
          <h2>Visión</h2>
          <p>
            Ser la agencia líder en Bolivia, reconocida por innovación y
            presencia nacional. Socio preferido para experiencias únicas
            alrededor del mundo.
          </p>
          <h2>Misión</h2>
          <p>
            Brindar un servicio excepcional, seguro y personalizado para
            convertir cada viaje en un recuerdo inolvidable.
          </p>
        </div>
      )}
    </div>
  );
}
