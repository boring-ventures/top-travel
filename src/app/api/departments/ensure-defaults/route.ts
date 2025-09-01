import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, ensureSuperadmin } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();
    ensureSuperadmin(session?.user);

    // Default data for WEDDINGS department
    const weddingsDefaults = {
      type: "WEDDINGS" as const,
      title: "Bodas de Destino",
      intro: "Planificamos bodas perfectas en destinos únicos",
      heroImageUrl: null,
      themeJson: {
        primaryColor: "#ee2b8d",
        accentColor: "#fcf8fa",
      },
      heroContentJson: {
        title: "Tu Boda de Destino",
        subtitle: "Perfectamente Planificada",
        description:
          "Déjanos manejar cada detalle, desde la selección del lugar hasta el catering, para que puedas enfocarte en celebrar tu amor.",
        primaryCTA: {
          text: "Comenzar Planificación",
          whatsappTemplate:
            "Hola! Me gustaría planificar mi boda de destino — {url}",
        },
        secondaryCTA: {
          text: "Explorar Destinos",
          href: "/destinations",
        },
      },
      packagesJson: [
        {
          name: "Básico",
          price: "$5,000",
          features: ["Selección de lugar", "Catering básico", "Fotografía"],
          color: "from-blue-500 to-blue-600",
          order: 0,
        },
        {
          name: "Premium",
          price: "$10,000",
          features: [
            "Lugar premium",
            "Catering gourmet",
            "Fotografía y videografía",
            "Entretenimiento",
          ],
          color: "from-purple-500 to-purple-600",
          order: 1,
        },
        {
          name: "Lujo",
          price: "$20,000",
          features: [
            "Lugar exclusivo",
            "Catering de lujo",
            "Fotografía y videografía",
            "Entretenimiento",
            "Servicio de conserjería personalizado",
          ],
          color: "from-pink-500 to-pink-600",
          order: 2,
        },
      ],
      servicesJson: [],
      contactInfoJson: {
        emails: [],
        phones: [],
        locations: [],
      },
      additionalContentJson: undefined,
    };

    // Default data for QUINCEANERA department
    const quinceaneraDefaults = {
      type: "QUINCEANERA" as const,
      title: "Quinceañeras",
      intro: "Celebraciones únicas para los 15 años",
      heroImageUrl: null,
      themeJson: {
        primaryColor: "#ee2b8d",
        accentColor: "#fcf8fa",
      },
      heroContentJson: {
        title: "Celebra su Quinceañera",
        subtitle: "con un Tour de Ensueño",
        description:
          "Creamos recorridos inolvidables a medida: destinos increíbles, detalles personalizados y logística completa para que disfruten sin preocupaciones.",
        primaryCTA: {
          text: "Planifica su tour ahora",
          whatsappTemplate:
            "Hola, quiero planificar un tour de Quinceañera — {url}",
        },
        secondaryCTA: {
          text: "Ver destinos",
          href: "/destinations",
        },
      },
      packagesJson: [],
      servicesJson: [
        {
          title: "Planificación experta",
          description:
            "Coordinamos vuelos, hoteles, actividades y celebraciones para una experiencia sin estrés.",
          icon: "Users",
          order: 0,
        },
        {
          title: "Toque personalizado",
          description:
            "Diseñamos el tour según sus gustos e intereses para un recuerdo verdaderamente único.",
          icon: "Heart",
          order: 1,
        },
        {
          title: "Seguridad y soporte 24/7",
          description:
            "Acompañamiento permanente y estándares de seguridad en cada detalle del viaje.",
          icon: "ShieldCheck",
          order: 2,
        },
      ],
      contactInfoJson: {
        emails: [],
        phones: [],
        locations: [],
      },
      additionalContentJson: {
        sampleItinerary: {
          title: "Itinerario sugerido: Quinceañera en París",
          description: "Un ejemplo de cómo puede ser su experiencia perfecta",
          days: [
            {
              title:
                "Día 1: Llegada a París y cena especial con vista a la Torre Eiffel",
              description:
                "Bienvenida a la Ciudad de las Luces. Check-in y cena de celebración.",
              icon: "Plane",
            },
            {
              title: "Día 2: Museo del Louvre y crucero por el Sena",
              description: "Arte y vistas románticas en el corazón de París.",
              icon: "Archive",
            },
            {
              title: "Día 3: Palacio de Versalles y compras parisinas",
              description: "Historia, glamour y vitrinas icónicas.",
              icon: "ShoppingBag",
            },
            {
              title: "Día 4: Disneyland Paris",
              description: "Diversión y momentos mágicos para toda la familia.",
              icon: "Castle",
            },
            {
              title: "Día 5: Regreso",
              description:
                "Vuelve a casa con recuerdos que durarán toda la vida.",
              icon: "Plane",
            },
          ],
        },
      },
    };

    const results = [];

    // Ensure WEDDINGS department exists
    const weddingsDept = await prisma.department.upsert({
      where: { type: "WEDDINGS" },
      update: {}, // Don't overwrite existing data
      create: weddingsDefaults,
    });
    results.push({ type: "WEDDINGS", action: "ensured", id: weddingsDept.id });

    // Ensure QUINCEANERA department exists
    const quinceaeneraDept = await prisma.department.upsert({
      where: { type: "QUINCEANERA" },
      update: {}, // Don't overwrite existing data
      create: quinceaneraDefaults,
    });
    results.push({
      type: "QUINCEANERA",
      action: "ensured",
      id: quinceaeneraDept.id,
    });

    return NextResponse.json({
      success: true,
      message: "Default departments ensured",
      results,
    });
  } catch (error: any) {
    console.error("Ensure defaults error:", error);
    return NextResponse.json(
      { error: "Failed to ensure default departments", details: error.message },
      { status: 500 }
    );
  }
}
