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

  const beachTag = await prisma.tag.upsert({
    where: { slug: "beach" },
    update: {},
    create: {
      name: "Beach",
      slug: "beach",
      type: "THEME",
    },
  });

  const cultureTag = await prisma.tag.upsert({
    where: { slug: "culture" },
    update: {},
    create: {
      name: "Culture",
      slug: "culture",
      type: "THEME",
    },
  });

  const adventureTag = await prisma.tag.upsert({
    where: { slug: "adventure" },
    update: {},
    create: {
      name: "Adventure",
      slug: "adventure",
      type: "THEME",
    },
  });

  const europeTag = await prisma.tag.upsert({
    where: { slug: "europe" },
    update: {},
    create: {
      name: "Europe",
      slug: "europe",
      type: "REGION",
    },
  });

  const asiaTag = await prisma.tag.upsert({
    where: { slug: "asia" },
    update: {},
    create: {
      name: "Asia",
      slug: "asia",
      type: "REGION",
    },
  });

  const weddingsTag = await prisma.tag.upsert({
    where: { slug: "weddings" },
    update: {},
    create: {
      name: "Weddings",
      slug: "weddings",
      type: "DEPARTMENT",
    },
  });

  const quinceaneraTag = await prisma.tag.upsert({
    where: { slug: "quinceanera" },
    update: {},
    create: {
      name: "Quinceañera",
      slug: "quinceanera",
      type: "DEPARTMENT",
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

  // Connect Rio to tags
  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: rio.id,
        tagId: southAmericaTag.id,
      },
    },
    update: {},
    create: {
      destinationId: rio.id,
      tagId: southAmericaTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: rio.id,
        tagId: beachTag.id,
      },
    },
    update: {},
    create: {
      destinationId: rio.id,
      tagId: beachTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: rio.id,
        tagId: cultureTag.id,
      },
    },
    update: {},
    create: {
      destinationId: rio.id,
      tagId: cultureTag.id,
    },
  });

  // More destinations
  const paris = await prisma.destination.upsert({
    where: { slug: "paris-france" },
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
    },
    create: {
      slug: "paris-france",
      country: "France",
      city: "Paris",
      isFeatured: true,
      description: "The City of Light, known for art, fashion, and romance.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
    },
  });

  // Connect Paris to tags
  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: paris.id,
        tagId: europeTag.id,
      },
    },
    update: {},
    create: {
      destinationId: paris.id,
      tagId: europeTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: paris.id,
        tagId: cultureTag.id,
      },
    },
    update: {},
    create: {
      destinationId: paris.id,
      tagId: cultureTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: paris.id,
        tagId: weddingsTag.id,
      },
    },
    update: {},
    create: {
      destinationId: paris.id,
      tagId: weddingsTag.id,
    },
  });

  const bali = await prisma.destination.upsert({
    where: { slug: "bali-indonesia" },
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
    },
    create: {
      slug: "bali-indonesia",
      country: "Indonesia",
      city: "Bali",
      isFeatured: true,
      description: "Tropical paradise with rich culture and stunning beaches.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
    },
  });

  // Connect Bali to tags
  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: bali.id,
        tagId: asiaTag.id,
      },
    },
    update: {},
    create: {
      destinationId: bali.id,
      tagId: asiaTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: bali.id,
        tagId: beachTag.id,
      },
    },
    update: {},
    create: {
      destinationId: bali.id,
      tagId: beachTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: bali.id,
        tagId: adventureTag.id,
      },
    },
    update: {},
    create: {
      destinationId: bali.id,
      tagId: adventureTag.id,
    },
  });

  const machuPicchu = await prisma.destination.upsert({
    where: { slug: "machu-picchu-peru" },
    update: {
      isFeatured: true,
      heroImageUrl:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
    },
    create: {
      slug: "machu-picchu-peru",
      country: "Peru",
      city: "Machu Picchu",
      isFeatured: true,
      description: "Ancient Incan citadel high in the Andes Mountains.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
    },
  });

  // Connect Machu Picchu to tags
  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: machuPicchu.id,
        tagId: southAmericaTag.id,
      },
    },
    update: {},
    create: {
      destinationId: machuPicchu.id,
      tagId: southAmericaTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: machuPicchu.id,
        tagId: cultureTag.id,
      },
    },
    update: {},
    create: {
      destinationId: machuPicchu.id,
      tagId: cultureTag.id,
    },
  });

  await prisma.destinationTag.upsert({
    where: {
      destinationId_tagId: {
        destinationId: machuPicchu.id,
        tagId: adventureTag.id,
      },
    },
    update: {},
    create: {
      destinationId: machuPicchu.id,
      tagId: adventureTag.id,
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
          { tagId: beachTag.id },
          { tagId: cultureTag.id },
        ],
      },
    },
  });

  // More packages
  const packageParis = await prisma.package.upsert({
    where: { slug: "paris-romance-7d6n" },
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
    },
    create: {
      slug: "paris-romance-7d6n",
      title: "Paris Romance 7D6N",
      summary:
        "Experience the magic of Paris with this romantic getaway package.",
      isCustom: false,
      fromPrice: 1800,
      currency: "USD",
      heroImageUrl:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
      inclusions: ["Hotel 4*", "Eiffel Tower visit", "Seine River cruise"],
      exclusions: ["Flights", "Personal expenses"],
      status: "PUBLISHED",
      packageDestinations: {
        create: [{ destinationId: paris.id }],
      },
      packageTags: {
        create: [
          { tagId: europeTag.id },
          { tagId: cultureTag.id },
          { tagId: weddingsTag.id },
        ],
      },
    },
  });

  const packageBali = await prisma.package.upsert({
    where: { slug: "bali-adventure-10d9n" },
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
    },
    create: {
      slug: "bali-adventure-10d9n",
      title: "Bali Adventure 10D9N",
      summary:
        "Explore the natural beauty and culture of Bali with adventure activities.",
      isCustom: false,
      fromPrice: 1500,
      currency: "USD",
      heroImageUrl:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      inclusions: ["Hotel 3*", "Temple tours", "Beach activities"],
      exclusions: ["Flights", "Personal expenses"],
      status: "PUBLISHED",
      packageDestinations: {
        create: [{ destinationId: bali.id }],
      },
      packageTags: {
        create: [
          { tagId: asiaTag.id },
          { tagId: beachTag.id },
          { tagId: adventureTag.id },
        ],
      },
    },
  });

  const packageMachuPicchu = await prisma.package.upsert({
    where: { slug: "machu-picchu-discovery-6d5n" },
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
    },
    create: {
      slug: "machu-picchu-discovery-6d5n",
      title: "Machu Picchu Discovery 6D5N",
      summary:
        "Discover the ancient wonders of Machu Picchu and the Sacred Valley.",
      isCustom: false,
      fromPrice: 900,
      currency: "USD",
      heroImageUrl:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
      inclusions: ["Hotel 3*", "Machu Picchu entrance", "Guide service"],
      exclusions: ["Flights", "Personal expenses"],
      status: "PUBLISHED",
      packageDestinations: {
        create: [{ destinationId: machuPicchu.id }],
      },
      packageTags: {
        create: [
          { tagId: southAmericaTag.id },
          { tagId: cultureTag.id },
          { tagId: adventureTag.id },
        ],
      },
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
      phoneNumber: "+59170000000",
      usageType: "GENERAL",
      isDefault: true,
    },
  });

  // Wedding WhatsApp Templates
  await prisma.whatsAppTemplate.upsert({
    where: { name: "Wedding Consultation" },
    update: {},
    create: {
      name: "Wedding Consultation",
      templateBody:
        "¡Hola! Estoy interesado en planificar mi boda de destino. Me gustaría recibir información sobre {itemTitle} - {url}",
      phoneNumber: "+59170000000",
      phoneNumbers: ["+59170000000", "+59170000001"],
      usageType: "WEDDINGS",
      isDefault: true,
    },
  });

  await prisma.whatsAppTemplate.upsert({
    where: { name: "Wedding Quote Request" },
    update: {},
    create: {
      name: "Wedding Quote Request",
      templateBody:
        "Hola, quiero cotizar mi boda de destino. Me interesa {itemTitle} - {url}",
      phoneNumber: "+59170000000",
      phoneNumbers: ["+59170000000", "+59170000001"],
      usageType: "WEDDINGS",
      isDefault: false,
    },
  });

  await prisma.whatsAppTemplate.upsert({
    where: { name: "Wedding Destination Info" },
    update: {},
    create: {
      name: "Wedding Destination Info",
      templateBody:
        "¡Hola! Me encanta este destino para mi boda: {itemTitle}. ¿Podrían enviarme más información? - {url}",
      phoneNumber: "+59170000000",
      phoneNumbers: ["+59170000000", "+59170000001"],
      usageType: "WEDDINGS",
      isDefault: false,
    },
  });

  // Quinceañera WhatsApp Templates
  await prisma.whatsAppTemplate.upsert({
    where: { name: "Quinceañera Consultation" },
    update: {},
    create: {
      name: "Quinceañera Consultation",
      templateBody:
        "¡Hola! Estoy interesada en planificar mi quinceañera de destino. Me gustaría recibir información sobre {itemTitle} - {url}",
      phoneNumber: "+59170000000",
      phoneNumbers: ["+59170000000", "+59170000001"],
      usageType: "QUINCEANERA",
      isDefault: true,
    },
  });

  await prisma.whatsAppTemplate.upsert({
    where: { name: "Quinceañera Quote Request" },
    update: {},
    create: {
      name: "Quinceañera Quote Request",
      templateBody:
        "Hola, quiero cotizar mi quinceañera de destino. Me interesa {itemTitle} - {url}",
      phoneNumber: "+59170000000",
      phoneNumbers: ["+59170000000", "+59170000001"],
      usageType: "QUINCEANERA",
      isDefault: false,
    },
  });

  await prisma.whatsAppTemplate.upsert({
    where: { name: "Quinceañera Destination Info" },
    update: {},
    create: {
      name: "Quinceañera Destination Info",
      templateBody:
        "¡Hola! Me encanta este destino para mi quinceañera: {itemTitle}. ¿Podrían enviarme más información? - {url}",
      phoneNumber: "+59170000000",
      phoneNumbers: ["+59170000000", "+59170000001"],
      usageType: "QUINCEANERA",
      isDefault: false,
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

  // Additional destinations for events
  const mexicoCity = await prisma.destination.upsert({
    where: { slug: "mexico-city-mexico" },
    update: {
      isFeatured: false,
      heroImageUrl:
        "https://images.unsplash.com/photo-1518105779142-d975f22f1d14",
    },
    create: {
      slug: "mexico-city-mexico",
      country: "Mexico",
      city: "Ciudad de México",
      isFeatured: false,
      description: "Vibrant capital with rich culture and entertainment.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1518105779142-d975f22f1d14",
    },
  });

  const vinaDelMar = await prisma.destination.upsert({
    where: { slug: "vina-del-mar-chile" },
    update: {
      isFeatured: false,
      heroImageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    },
    create: {
      slug: "vina-del-mar-chile",
      country: "Chile",
      city: "Viña del Mar",
      isFeatured: false,
      description: "Coastal city known for its music festival and beaches.",
      heroImageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    },
  });

  // Events (after all destinations are created)
  await prisma.event.upsert({
    where: { slug: "rock-in-rio-2025" },
    update: {
      startDate: new Date("2025-09-13"),
      endDate: new Date("2025-09-22"),
      status: "PUBLISHED",
      destinationId: rio.id,
    },
    create: {
      slug: "rock-in-rio-2025",
      title: "Rock in Rio 2025",
      artistOrEvent: "Rock in Rio",
      destinationId: rio.id,
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
      destinationId: miami.id,
    },
    create: {
      slug: "bad-bunny-miami-2026",
      title: "Bad Bunny World Tour 2026",
      artistOrEvent: "Bad Bunny",
      destinationId: miami.id,
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
      destinationId: mexicoCity.id,
    },
    create: {
      slug: "karol-g-mx-2026",
      title: "Karol G – Mañana Será Bonito 2026",
      artistOrEvent: "Karol G",
      destinationId: mexicoCity.id,
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
      destinationId: vinaDelMar.id,
    },
    create: {
      slug: "vina-del-mar-2026",
      title: "Festival de Viña del Mar 2026",
      artistOrEvent: "Festival de Viña del Mar",
      destinationId: vinaDelMar.id,
      startDate: new Date("2026-02-20"),
      endDate: new Date("2026-02-25"),
      fromPrice: 260,
      currency: "USD",
      status: "PUBLISHED",
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

  // Departments with enhanced data
  await prisma.department.upsert({
    where: { type: "WEDDINGS" },
    update: {
      heroImageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      servicesJson: [
        {
          title: "Planificación Completa",
          description:
            "Manejamos cada detalle de tu boda desde la selección del lugar hasta el catering",
          icon: "Calendar",
          order: 1,
        },
        {
          title: "Coordinación de Eventos",
          description:
            "Coordinamos todos los eventos relacionados con tu celebración",
          icon: "Users",
          order: 2,
        },
        {
          title: "Servicios de Catering",
          description: "Catering gourmet personalizado para tu evento especial",
          icon: "Utensils",
          order: 3,
        },
      ],
      contactInfoJson: {
        emails: ["bodas@toptravel.com", "info@toptravel.com"],
        phones: [
          {
            number: "+591 2 1234567",
            label: "Oficina Principal",
          },
          {
            number: "+591 700 12345",
            label: "WhatsApp",
          },
        ],
        locations: [
          {
            address: "Av. 16 de Julio 1234",
            city: "La Paz",
            country: "Bolivia",
            label: "Oficina Principal",
          },
        ],
      },
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
      servicesJson: [
        {
          title: "Planificación Completa",
          description:
            "Manejamos cada detalle de tu boda desde la selección del lugar hasta el catering",
          icon: "Calendar",
          order: 1,
        },
        {
          title: "Coordinación de Eventos",
          description:
            "Coordinamos todos los eventos relacionados con tu celebración",
          icon: "Users",
          order: 2,
        },
        {
          title: "Servicios de Catering",
          description: "Catering gourmet personalizado para tu evento especial",
          icon: "Utensils",
          order: 3,
        },
      ],
      contactInfoJson: {
        emails: ["bodas@toptravel.com", "info@toptravel.com"],
        phones: [
          {
            number: "+591 2 1234567",
            label: "Oficina Principal",
          },
          {
            number: "+591 700 12345",
            label: "WhatsApp",
          },
        ],
        locations: [
          {
            address: "Av. 16 de Julio 1234",
            city: "La Paz",
            country: "Bolivia",
            label: "Oficina Principal",
          },
        ],
      },
    },
  });
  await prisma.department.upsert({
    where: { type: "QUINCEANERA" },
    update: {
      heroImageUrl: "https://images.unsplash.com/photo-1542326237-94b1c5a538d7",
      servicesJson: [
        {
          title: "Planificación de Tour",
          description:
            "Creamos itinerarios personalizados para toda la familia",
          icon: "Map",
          order: 1,
        },
        {
          title: "Celebración Especial",
          description:
            "Organizamos la celebración de quinceañera en el destino",
          icon: "Crown",
          order: 2,
        },
        {
          title: "Logística Completa",
          description: "Manejamos vuelos, hoteles, traslados y actividades",
          icon: "Plane",
          order: 3,
        },
      ],
      contactInfoJson: {
        emails: ["quinceanera@toptravel.com", "info@toptravel.com"],
        phones: [
          {
            number: "+591 2 1234567",
            label: "Oficina Principal",
          },
          {
            number: "+591 700 12345",
            label: "WhatsApp",
          },
        ],
        locations: [
          {
            address: "Av. 16 de Julio 1234",
            city: "La Paz",
            country: "Bolivia",
            label: "Oficina Principal",
          },
        ],
      },
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
      servicesJson: [
        {
          title: "Planificación de Tour",
          description:
            "Creamos itinerarios personalizados para toda la familia",
          icon: "Map",
          order: 1,
        },
        {
          title: "Celebración Especial",
          description:
            "Organizamos la celebración de quinceañera en el destino",
          icon: "Crown",
          order: 2,
        },
        {
          title: "Logística Completa",
          description: "Manejamos vuelos, hoteles, traslados y actividades",
          icon: "Plane",
          order: 3,
        },
      ],
      contactInfoJson: {
        emails: ["quinceanera@toptravel.com", "info@toptravel.com"],
        phones: [
          {
            number: "+591 2 1234567",
            label: "Oficina Principal",
          },
          {
            number: "+591 700 12345",
            label: "WhatsApp",
          },
        ],
        locations: [
          {
            address: "Av. 16 de Julio 1234",
            city: "La Paz",
            country: "Bolivia",
            label: "Oficina Principal",
          },
        ],
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

  // Wedding Destinations
  await prisma.weddingDestination.upsert({
    where: { slug: "bodas-paris" },
    update: {},
    create: {
      slug: "bodas-paris",
      name: "París",
      title: "Bodas en París",
      description:
        "La Ciudad del Amor es el lugar perfecto para tu boda de ensueño. Desde la Torre Eiffel hasta el Palacio de Versalles, cada rincón de París ofrece un escenario mágico para tu celebración.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
      gallery: [
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
      ],
      isFeatured: true,
    },
  });

  await prisma.weddingDestination.upsert({
    where: { slug: "bodas-bali" },
    update: {},
    create: {
      slug: "bodas-bali",
      name: "Bali",
      title: "Bodas en Bali",
      description:
        "Celebra tu boda en el paraíso tropical de Bali. Playas de arena blanca, templos ancestrales y resorts de lujo crean el ambiente perfecto para una boda exótica y romántica.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      gallery: [
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
        "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c",
      ],
      isFeatured: true,
    },
  });

  // Quinceanera Destinations
  await prisma.quinceaneraDestination.upsert({
    where: { slug: "quinceanera-paris" },
    update: {},
    create: {
      slug: "quinceanera-paris",
      name: "París",
      title: "Quinceañeras en París",
      description:
        "Haz que su quinceañera sea inolvidable en la Ciudad de las Luces. Disneyland Paris, la Torre Eiffel y los Campos Elíseos crearán recuerdos mágicos para toda la familia.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
      gallery: [
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
      ],
      isFeatured: true,
    },
  });

  await prisma.quinceaneraDestination.upsert({
    where: { slug: "quinceanera-miami" },
    update: {},
    create: {
      slug: "quinceanera-miami",
      name: "Miami",
      title: "Quinceañeras en Miami",
      description:
        "Celebra su quinceañera en la vibrante ciudad de Miami. Playas, centros comerciales de lujo y la vida nocturna crean la combinación perfecta para una celebración moderna y emocionante.",
      heroImageUrl: "https://images.unsplash.com/photo-1545420331-221ea6b0d3f0",
      gallery: [
        "https://images.unsplash.com/photo-1545420331-221ea6b0d3f0",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      ],
      isFeatured: true,
    },
  });

  // Blog Posts
  await prisma.blogPost.upsert({
    where: { slug: "planificando-boda-paris" },
    update: {},
    create: {
      slug: "planificando-boda-paris",
      title: "Planificando tu Boda de Ensueño en París",
      excerpt:
        "Descubre los secretos para organizar la boda perfecta en la Ciudad del Amor. Desde la selección del lugar hasta los detalles finales.",
      content:
        "París, la Ciudad del Amor, es el destino por excelencia para bodas románticas y elegantes. En este artículo te guiamos a través de todo lo que necesitas saber para planificar tu boda de ensueño en la capital francesa.\n\n## Selección del Lugar\n\nParís ofrece una amplia variedad de opciones para celebrar tu boda:\n\n- **Torre Eiffel**: Para bodas icónicas con vistas espectaculares\n- **Palacio de Versalles**: Para celebraciones reales y elegantes\n- **Hoteles de lujo**: Como el Ritz o el Plaza Athénée\n- **Jardines históricos**: Como los Jardines de Luxemburgo\n\n## Temporadas Recomendadas\n\nLa primavera (abril-junio) y el otoño (septiembre-octubre) son las mejores épocas para bodas en París, con temperaturas agradables y menos turistas.\n\n## Documentación Necesaria\n\nPara casarte en Francia necesitarás:\n- Certificado de nacimiento\n- Certificado de soltería\n- Pasaporte válido\n- Traducción oficial de documentos\n\n## Presupuesto Estimado\n\nUna boda en París puede costar entre $15,000 y $50,000 USD, dependiendo del lugar y servicios elegidos.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      author: "Equipo Top Travel",
      publishedAt: new Date("2024-01-15"),
      status: "PUBLISHED",
      type: "WEDDINGS",
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "quinceanera-miami-guia" },
    update: {},
    create: {
      slug: "quinceanera-miami-guia",
      title: "Guía Completa para Quinceañeras en Miami",
      excerpt:
        "Todo lo que necesitas saber para planificar la quinceañera perfecta en Miami. Desde actividades hasta los mejores lugares para celebrar.",
      content:
        "Miami es uno de los destinos más populares para celebrar quinceañeras, y no es difícil entender por qué. Esta vibrante ciudad ofrece una combinación perfecta de playas, entretenimiento y cultura latina.\n\n## Actividades Imperdibles\n\n### 1. South Beach\nLas playas de Miami Beach son perfectas para sesiones de fotos y actividades acuáticas.\n\n### 2. Bayside Marketplace\nCentro comercial con tiendas, restaurantes y paseos en barco.\n\n### 3. Wynwood Walls\nPara fotos artísticas en el famoso distrito de arte callejero.\n\n### 4. Dolphin Mall\nUno de los centros comerciales más grandes de Miami con outlets.\n\n## Lugares para la Celebración\n\n- **Hoteles de lujo**: Fontainebleau, W South Beach\n- **Restaurantes**: Versace Mansion, Zuma\n- **Yates privados**: Para celebraciones únicas en el mar\n\n## Itinerario Sugerido\n\n**Día 1**: Llegada y check-in en el hotel\n**Día 2**: South Beach y sesión de fotos\n**Día 3**: Shopping en Dolphin Mall\n**Día 4**: Celebración principal\n**Día 5**: Wynwood y despedida\n\n## Presupuesto Estimado\n\nUna quinceañera en Miami puede costar entre $8,000 y $25,000 USD, incluyendo vuelos, hotel, actividades y celebración.",
      heroImageUrl: "https://images.unsplash.com/photo-1542326237-94b1c5a538d7",
      author: "Equipo Top Travel",
      publishedAt: new Date("2024-01-20"),
      status: "PUBLISHED",
      type: "QUINCEANERA",
    },
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
