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
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    create: {
      slug: "rio-de-janeiro-brazil",
      country: "Brazil",
      city: "Rio de Janeiro",
      isFeatured: true,
      description: "Vibrant city known for beaches, culture, and carnival.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
  });

  // Package
  const packageRio = await prisma.package.upsert({
    where: { slug: "rio-carnival-5d4n" },
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    },
    create: {
      slug: "rio-carnival-5d4n",
      title: "Rio Carnival 5D4N",
      summary:
        "Experience the ultimate carnival in Rio with a curated itinerary.",
      isCustom: false,
      fromPrice: 1200,
      currency: "USD",
      heroImageUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
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
    update: {
      startDate: new Date("2025-09-13"),
      endDate: new Date("2025-09-22"),
      status: "PUBLISHED",
    },
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

  // More events (future dates)
  await prisma.event.upsert({
    where: { slug: "bad-bunny-miami-2026" },
    update: {
      startDate: new Date("2026-04-10"),
      endDate: new Date("2026-04-12"),
      status: "PUBLISHED",
    },
    create: {
      slug: "bad-bunny-miami-2026",
      title: "Bad Bunny World Tour 2026",
      artistOrEvent: "Bad Bunny",
      locationCity: "Miami",
      locationCountry: "USA",
      startDate: new Date("2026-04-10"),
      endDate: new Date("2026-04-12"),
      fromPrice: 280,
      currency: "USD",
      status: "PUBLISHED",
    },
  });
  await prisma.event.upsert({
    where: { slug: "karol-g-mx-2026" },
    update: {
      startDate: new Date("2026-05-20"),
      endDate: new Date("2026-05-21"),
      status: "PUBLISHED",
    },
    create: {
      slug: "karol-g-mx-2026",
      title: "Karol G – Mañana Será Bonito 2026",
      artistOrEvent: "Karol G",
      locationCity: "Ciudad de México",
      locationCountry: "Mexico",
      startDate: new Date("2026-05-20"),
      endDate: new Date("2026-05-21"),
      fromPrice: 220,
      currency: "USD",
      status: "PUBLISHED",
    },
  });
  await prisma.event.upsert({
    where: { slug: "vina-del-mar-2026" },
    update: {
      startDate: new Date("2026-02-20"),
      endDate: new Date("2026-02-25"),
      status: "PUBLISHED",
    },
    create: {
      slug: "vina-del-mar-2026",
      title: "Festival de Viña del Mar 2026",
      artistOrEvent: "Festival de Viña del Mar",
      locationCity: "Viña del Mar",
      locationCountry: "Chile",
      startDate: new Date("2026-02-20"),
      endDate: new Date("2026-02-25"),
      fromPrice: 260,
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
  if (existingOffer) {
    await prisma.offer.update({
      where: { id: existingOffer.id },
      data: {
        isFeatured: true,
        packageId: packageRio.id,
        status: "PUBLISHED",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      },
    });
  } else {
    await prisma.offer.create({
      data: {
        title: "Limited Offer: Rio Carnival",
        subtitle: "Reserva anticipada",
        isFeatured: true,
        packageId: packageRio.id,
        status: "PUBLISHED",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
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
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    },
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
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
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
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
    },
    create: {
      slug: "buenos-aires-argentina",
      country: "Argentina",
      city: "Buenos Aires",
      isFeatured: true,
      description: "Vibrant capital known for tango, food, and European flair.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
    },
  });

  // Additional featured destinations to ensure a rich landing page
  const cartagena = await prisma.destination.upsert({
    where: { slug: "cartagena-colombia" },
    update: {
      isFeatured: true,
      heroImageUrl: "https://images.unsplash.com/photo-1544989164-31dc3c645987",
    },
    create: {
      slug: "cartagena-colombia",
      country: "Colombia",
      city: "Cartagena",
      isFeatured: true,
      description: "City of colorful streets and Caribbean charm.",
      heroImageUrl: "https://images.unsplash.com/photo-1544989164-31dc3c645987",
    },
  });
  const puntaCana = await prisma.destination.upsert({
    where: { slug: "punta-cana-dominican-republic" },
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    },
    create: {
      slug: "punta-cana-dominican-republic",
      country: "Dominican Republic",
      city: "Punta Cana",
      isFeatured: true,
      description: "Resort heaven with palm-lined beaches.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    },
  });
  const miami = await prisma.destination.upsert({
    where: { slug: "miami-usa" },
    update: {
      isFeatured: true,
      heroImageUrl: "https://images.unsplash.com/photo-1545420331-221ea6b0d3f0",
    },
    create: {
      slug: "miami-usa",
      country: "USA",
      city: "Miami",
      isFeatured: true,
      description: "Vibrant nightlife, beaches and Latin flavor.",
      heroImageUrl: "https://images.unsplash.com/photo-1545420331-221ea6b0d3f0",
    },
  });

  // More Packages
  const mpPackage = await prisma.package.upsert({
    where: { slug: "machu-picchu-4d3n" },
    update: {
      heroImageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147",
    },
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
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
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
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
    },
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
  if (existingOffer2) {
    await prisma.offer.update({
      where: { id: existingOffer2.id },
      data: {
        isFeatured: true,
        packageId: mpPackage.id,
        status: "PUBLISHED",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1549144511-f099e773c147",
      },
    });
  } else {
    await prisma.offer.create({
      data: {
        title: "Featured: Machu Picchu Special",
        subtitle: "Salida limitada",
        isFeatured: true,
        packageId: mpPackage.id,
        status: "PUBLISHED",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1549144511-f099e773c147",
      },
    });
  }
  const existingOffer3 = await prisma.offer.findFirst({
    where: { title: "Featured: Cancún Beach Deal" },
  });
  if (existingOffer3) {
    await prisma.offer.update({
      where: { id: existingOffer3.id },
      data: {
        isFeatured: true,
        packageId: cancunPkg.id,
        status: "PUBLISHED",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
    });
  } else {
    await prisma.offer.create({
      data: {
        title: "Featured: Cancún Beach Deal",
        subtitle: "Todo sol y mar",
        isFeatured: true,
        packageId: cancunPkg.id,
        status: "PUBLISHED",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
    });
  }

  // Extra featured offer (external URL)
  const existingOffer4 = await prisma.offer.findFirst({
    where: { title: "Featured: Punta Cana All Inclusive" },
  });
  if (existingOffer4) {
    await prisma.offer.update({
      where: { id: existingOffer4.id },
      data: {
        isFeatured: true,
        status: "PUBLISHED",
        externalUrl: "https://example.com/punta-cana",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206",
      },
    });
  } else {
    await prisma.offer.create({
      data: {
        title: "Featured: Punta Cana All Inclusive",
        subtitle: "Resort 5* + vuelos",
        isFeatured: true,
        status: "PUBLISHED",
        externalUrl: "https://example.com/punta-cana",
        bannerImageUrl:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206",
      },
    });
  }

  // Fixed Departures
  await prisma.fixedDeparture.upsert({
    where: { slug: "machu-picchu-oct-2025" },
    update: {
      startDate: new Date("2025-10-10"),
      endDate: new Date("2025-10-14"),
      status: "PUBLISHED",
    },
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
    update: {
      startDate: new Date("2026-03-20"),
      endDate: new Date("2026-03-24"),
      status: "PUBLISHED",
    },
    create: {
      slug: "cancun-spring-2025",
      title: "Cancún Spring Break 2025",
      destinationId: cancun.id,
      startDate: new Date("2026-03-20"),
      endDate: new Date("2026-03-24"),
      status: "PUBLISHED",
    },
  });
  await prisma.fixedDeparture.upsert({
    where: { slug: "rio-carnival-2026" },
    update: {
      startDate: new Date("2026-02-10"),
      endDate: new Date("2026-02-15"),
      status: "PUBLISHED",
    },
    create: {
      slug: "rio-carnival-2026",
      title: "Rio Carnival Group 2026",
      destinationId: rio.id,
      startDate: new Date("2026-02-10"),
      endDate: new Date("2026-02-15"),
      status: "PUBLISHED",
    },
  });

  // Departments
  await prisma.department.upsert({
    where: { type: "WEDDINGS" },
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    },
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
    update: {
      heroImageUrl: "https://images.unsplash.com/photo-1542326237-94b1c5a538d7",
    },
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
      {
        authorName: "María J.",
        location: "Cochabamba, BO",
        rating: 5,
        content:
          "Nuestra boda en Punta Cana fue un sueño. Cuidaron cada detalle.",
        status: "PUBLISHED",
      },
      {
        authorName: "Carlos T.",
        location: "Tarija, BO",
        rating: 5,
        content:
          "Concierto en Miami impecable: entradas, traslados y hotel de 10.",
        status: "PUBLISHED",
      },
      {
        authorName: "Sofía M.",
        location: "Sucre, BO",
        rating: 5,
        content: "El equipo es súper atento. Repetiremos sin duda.",
        status: "PUBLISHED",
      },
      {
        authorName: "Diego A.",
        location: "Oruro, BO",
        rating: 4,
        content: "Muy buena coordinación y recomendaciones. Gran experiencia.",
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
