import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/utils/whatsapp-cta";
import { Check, Star } from "lucide-react";

export default async function WeddingsPage() {
  const [dept, destinations, testimonials] = await Promise.all([
    prisma.department.findUnique({ where: { type: "WEDDINGS" } }),
    prisma.destination.findMany({
      where: { isFeatured: true },
      take: 6,
      select: {
        id: true,
        slug: true,
        city: true,
        country: true,
        heroImageUrl: true,
      },
    }),
    prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        authorName: true,
        location: true,
        rating: true,
        content: true,
      },
    }),
  ]);

  const primary = (dept?.themeJson as any)?.primaryColor ?? "#ee2b8d";
  const accent = (dept?.themeJson as any)?.accentColor ?? "#fcf8fa";
  const hero = dept?.heroImageUrl;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          aria-label="Weddings"
          role="region"
        >
          <div className="absolute inset-0 -z-10">
            {hero ? (
              <Image
                src={hero}
                alt="Weddings"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Your Dream Wedding, Perfectly Planned
              </h1>
              <p className="mt-3 sm:mt-4 text-white/90 text-base sm:text-lg">
                Let us handle every detail, from venue selection to catering, so
                you can focus on celebrating your love.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <WhatsAppCTA
                  template="Hello! I'd like to plan my destination wedding — {url}"
                  variables={{ url: "" }}
                  label="Start Planning"
                  size="lg"
                  className="rounded-full h-12 px-5"
                />
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full h-12 px-5"
                >
                  <Link href="/destinations">Browse destinations</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Featured Destinations
          </h2>
          <div className="mt-6 flex overflow-x-auto gap-3 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch gap-3">
              {destinations.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  We will publish featured destinations soon.
                </div>
              ) : (
                destinations.map((d) => (
                  <Card
                    key={d.id}
                    className="flex h-full min-w-60 flex-1 flex-col gap-3 p-3"
                  >
                    <Link href={`/destinations/${d.slug}`} className="block">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        {d.heroImageUrl ? (
                          <Image
                            src={d.heroImageUrl}
                            alt={`${d.city}, ${d.country}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 80vw, 30vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="text-base font-medium">
                          {d.city}, {d.country}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Exchange vows in a stunning setting.
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Customizable Packages
          </h2>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">
            Our wedding packages are flexible. Tailor venues, catering and
            activities to create a celebration that reflects your unique love
            story.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                name: "Basic",
                price: "$5,000",
                features: ["Venue selection", "Basic catering", "Photography"],
              },
              {
                name: "Premium",
                price: "$10,000",
                features: [
                  "Premium venue",
                  "Gourmet catering",
                  "Photography & videography",
                  "Entertainment",
                ],
              },
              {
                name: "Luxury",
                price: "$20,000",
                features: [
                  "Exclusive venue",
                  "Luxury catering",
                  "Photography & videography",
                  "Entertainment",
                  "Personalized concierge service",
                ],
              },
            ].map((p) => (
              <Card key={p.name} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold">{p.name}</h3>
                  <p className="flex items-baseline gap-1">
                    <span
                      className="text-4xl font-extrabold"
                      style={{ color: primary }}
                    >
                      {p.price}
                    </span>
                    <span className="text-sm font-semibold">per wedding</span>
                  </p>
                </div>
                <Button variant="secondary" className="h-10 rounded-xl">
                  Select Plan
                </Button>
                <div className="flex flex-col gap-2">
                  {p.features.map((f) => (
                    <div key={f} className="text-sm flex items-start gap-3">
                      <Check
                        className="h-5 w-5 text-foreground"
                        aria-hidden="true"
                      />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Testimonials
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {testimonials.length === 0 ? (
              <Card className="p-5 text-sm text-muted-foreground">
                We will publish testimonials soon.
              </Card>
            ) : (
              testimonials.map((t) => (
                <Card key={t.id} className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="text-base font-medium leading-tight">
                        {t.authorName}
                      </div>
                      <div className="text-xs text-muted-foreground leading-tight">
                        {t.location ?? ""}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {Array.from({
                      length: Math.max(0, Math.min(5, t.rating ?? 5)),
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        style={{ color: primary }}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-foreground">{t.content}</p>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Ready to Start Planning Your Dream Wedding?
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Contact us today for a free consultation and let us help you
              create the wedding of your dreams.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <WhatsAppCTA
                template="Hello, I want a free wedding planning quote — {url}"
                variables={{ url: "" }}
                label="Get a Free Quote"
                size="lg"
                className="rounded-full h-12 px-5"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
