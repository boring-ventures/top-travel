import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tags
  const southAmericaTag = await prisma.tag.upsert({
    where: { slug: "south-america" },
    update: {},
    create: {
      name: "South America",
      slug: "south-america",
      type: "REGION",
    },
  });

  const topDestinationsTag = await prisma.tag.upsert({
    where: { slug: "top-destinations" },
    update: {},
    create: {
      name: "Top destinations",
      slug: "top-destinations",
      type: "THEME",
    },
  });

  // Destination
  const rio = await prisma.destination.upsert({
    where: { slug: "rio-de-janeiro-brazil" },
    update: {},
    create: {
      slug: "rio-de-janeiro-brazil",
      country: "Brazil",
      city: "Rio de Janeiro",
      isFeatured: true,
      description: "Vibrant city known for beaches, culture, and carnival.",
    },
  });

  // Package
  const packageRio = await prisma.package.upsert({
    where: { slug: "rio-carnival-5d4n" },
    update: {},
    create: {
      slug: "rio-carnival-5d4n",
      title: "Rio Carnival 5D4N",
      summary:
        "Experience the ultimate carnival in Rio with a curated itinerary.",
      isCustom: false,
      fromPrice: 1200,
      currency: "USD",
      inclusions: ["Hotel 4*", "Airport transfers", "City tour"],
      exclusions: ["Flights", "Personal expenses"],
      status: "PUBLISHED",
      packageDestinations: {
        create: [{ destinationId: rio.id }],
      },
      packageTags: {
        create: [
          { tagId: southAmericaTag.id },
          { tagId: topDestinationsTag.id },
        ],
      },
    },
  });

  // Event
  await prisma.event.upsert({
    where: { slug: "rock-in-rio-2025" },
    update: {},
    create: {
      slug: "rock-in-rio-2025",
      title: "Rock in Rio 2025",
      artistOrEvent: "Rock in Rio",
      locationCity: "Rio de Janeiro",
      locationCountry: "Brazil",
      startDate: new Date("2025-09-13"),
      endDate: new Date("2025-09-22"),
      fromPrice: 300,
      currency: "USD",
      status: "PUBLISHED",
    },
  });

  // WhatsApp Template (default)
  await prisma.whatsAppTemplate.upsert({
    where: { name: "Default" },
    update: { isDefault: true },
    create: {
      name: "Default",
      templateBody:
        "Hola, estoy interesado en {itemTitle} - {url} (utm: {utmSource}/{utmCampaign})",
      isDefault: true,
    },
  });

  // Offer linked to the package
  const existingOffer = await prisma.offer.findFirst({
    where: { title: "Limited Offer: Rio Carnival" },
  });
  if (!existingOffer) {
    await prisma.offer.create({
      data: {
        title: "Limited Offer: Rio Carnival",
        subtitle: "Reserva anticipada",
        isFeatured: true,
        packageId: packageRio.id,
        status: "PUBLISHED",
      },
    });
  }

  // Additional Tags
  const beachTag = await prisma.tag.upsert({
    where: { slug: "beach" },
    update: {},
    create: { name: "Beach", slug: "beach", type: "THEME" },
  });
  const adventureTag = await prisma.tag.upsert({
    where: { slug: "adventure" },
    update: {},
    create: { name: "Adventure", slug: "adventure", type: "THEME" },
  });
  const cityTag = await prisma.tag.upsert({
    where: { slug: "city" },
    update: {},
    create: { name: "City", slug: "city", type: "THEME" },
  });

  // More Destinations
  const cusco = await prisma.destination.upsert({
    where: { slug: "cusco-peru" },
    update: {},
    create: {
      slug: "cusco-peru",
      country: "Peru",
      city: "Cusco",
      isFeatured: true,
      description: "Gateway to Machu Picchu with rich Incan history.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    },
  });
  const cancun = await prisma.destination.upsert({
    where: { slug: "cancun-mexico" },
    update: {},
    create: {
      slug: "cancun-mexico",
      country: "Mexico",
      city: "Cancún",
      isFeatured: true,
      description: "White-sand beaches and turquoise Caribbean waters.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
  });
  const buenosAires = await prisma.destination.upsert({
    where: { slug: "buenos-aires-argentina" },
    update: {},
    create: {
      slug: "buenos-aires-argentina",
      country: "Argentina",
      city: "Buenos Aires",
      isFeatured: false,
      description: "Vibrant capital known for tango, food, and European flair.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
    },
  });

  // More Packages
  const mpPackage = await prisma.package.upsert({
    where: { slug: "machu-picchu-4d3n" },
    update: {},
    create: {
      slug: "machu-picchu-4d3n",
      title: "Machu Picchu 4D3N",
      summary: "Explore the Sacred Valley and Machu Picchu with expert guides.",
      isCustom: false,
      fromPrice: 980,
      currency: "USD",
      heroImageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147",
      inclusions: ["Hotel 3*+", "Guided tours", "Breakfast"],
      exclusions: ["International flights"],
      status: "PUBLISHED",
      packageDestinations: { create: [{ destinationId: cusco.id }] },
      packageTags: { create: [{ tagId: adventureTag.id }] },
    },
  });

  const cancunPkg = await prisma.package.upsert({
    where: { slug: "cancun-beach-4d3n" },
    update: {},
    create: {
      slug: "cancun-beach-4d3n",
      title: "Cancún Beach Escape 4D3N",
      summary: "All about sun, sand, and relaxation on the Caribbean coast.",
      isCustom: false,
      fromPrice: 750,
      currency: "USD",
      heroImageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      inclusions: ["Hotel 4*", "Airport transfers"],
      exclusions: ["Tours", "Tips"],
      status: "PUBLISHED",
      packageDestinations: { create: [{ destinationId: cancun.id }] },
      packageTags: { create: [{ tagId: beachTag.id }] },
    },
  });

  const baPkg = await prisma.package.upsert({
    where: { slug: "buenos-aires-4d3n" },
    update: {},
    create: {
      slug: "buenos-aires-4d3n",
      title: "Buenos Aires City Break 4D3N",
      summary:
        "Discover the soul of Buenos Aires with a curated city itinerary.",
      isCustom: false,
      fromPrice: 640,
      currency: "USD",
      heroImageUrl:
        "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
      inclusions: ["Hotel 4*", "City tour"],
      exclusions: ["Flights"],
      status: "PUBLISHED",
      packageDestinations: { create: [{ destinationId: buenosAires.id }] },
      packageTags: { create: [{ tagId: cityTag.id }] },
    },
  });

  // More Offers
  const existingOffer2 = await prisma.offer.findFirst({
    where: { title: "Featured: Machu Picchu Special" },
  });
  if (!existingOffer2) {
    await prisma.offer.create({
      data: {
        title: "Featured: Machu Picchu Special",
        subtitle: "Salida limitada",
        isFeatured: true,
        packageId: mpPackage.id,
        status: "PUBLISHED",
      },
    });
  }
  const existingOffer3 = await prisma.offer.findFirst({
    where: { title: "Featured: Cancún Beach Deal" },
  });
  if (!existingOffer3) {
    await prisma.offer.create({
      data: {
        title: "Featured: Cancún Beach Deal",
        subtitle: "Todo sol y mar",
        isFeatured: true,
        packageId: cancunPkg.id,
        status: "PUBLISHED",
      },
    });
  }

  // Fixed Departures
  await prisma.fixedDeparture.upsert({
    where: { slug: "machu-picchu-oct-2025" },
    update: {},
    create: {
      slug: "machu-picchu-oct-2025",
      title: "Machu Picchu Group Oct 2025",
      destinationId: cusco.id,
      startDate: new Date("2025-10-10"),
      endDate: new Date("2025-10-14"),
      status: "PUBLISHED",
    },
  });
  await prisma.fixedDeparture.upsert({
    where: { slug: "cancun-spring-2025" },
    update: {},
    create: {
      slug: "cancun-spring-2025",
      title: "Cancún Spring Break 2025",
      destinationId: cancun.id,
      startDate: new Date("2025-03-20"),
      endDate: new Date("2025-03-24"),
      status: "PUBLISHED",
    },
  });

  // Departments
  await prisma.department.upsert({
    where: { type: "WEDDINGS" },
    update: {},
    create: {
      type: "WEDDINGS",
      title: "Destination Weddings",
      intro:
        "From beach ceremonies to historic venues, we craft your perfect day.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      themeJson: {
        primaryColor: "#9b87f5",
        accentColor: "#f5a3b3",
      },
    },
  });
  await prisma.department.upsert({
    where: { type: "QUINCEANERA" },
    update: {},
    create: {
      type: "QUINCEANERA",
      title: "Quinceañera Dream Trips",
      intro: "Make her XV unforgettable with curated destinations and events.",
      heroImageUrl: "https://images.unsplash.com/photo-1542326237-94b1c5a538d7",
      themeJson: {
        primaryColor: "#f59eb6",
        accentColor: "#9b87f5",
      },
    },
  });

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Ana P.",
        location: "Santa Cruz, BO",
        rating: 5,
        content: "Excelente servicio, el viaje a Cancún fue perfecto!",
        status: "PUBLISHED",
      },
      {
        authorName: "Luis R.",
        location: "La Paz, BO",
        rating: 5,
        content: "La organización para Machu Picchu fue impecable.",
        status: "PUBLISHED",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
