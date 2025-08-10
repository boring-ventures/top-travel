import prisma from "@/lib/prisma";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Testimonios</h1>
      {testimonials.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No hay testimonios publicados aún.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <li key={t.id} className="rounded border p-4">
              <div className="font-medium">{t.authorName}</div>
              {t.location && (
                <div className="text-xs text-muted-foreground">
                  {t.location}
                </div>
              )}
              <div className="mt-2 text-sm">{t.content}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
