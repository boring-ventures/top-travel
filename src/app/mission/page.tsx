import prisma from "@/lib/prisma";

export default async function MissionPage() {
  const page = await prisma.page.findUnique({ where: { slug: "mission" } });
  const fallback = (
    <p>
      "Entregar un servicio excepcional, seguro y totalmente personalizado;
      convertir cada viaje en un recuerdo inolvidable, gestionando la logística
      integral para experiencias sin estrés."
    </p>
  );
  const content = page && page.status === "PUBLISHED" && page.sectionsJson;

  return (
    <div className="container mx-auto py-10 space-y-4 max-w-3xl">
      <h1 className="text-3xl font-semibold">Misión</h1>
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
