const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkEvents() {
  try {
    // Get all events
    const allEvents = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        endDate: true,
        locationCity: true,
        locationCountry: true,
      },
    });

    console.log(`Total events in database: ${allEvents.length}`);

    // Group by status
    const byStatus = allEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {});

    console.log("Events by status:", byStatus);

    // Show published events
    const publishedEvents = allEvents.filter((e) => e.status === "PUBLISHED");
    console.log(`\nPublished events (${publishedEvents.length}):`);
    publishedEvents.forEach((event) => {
      console.log(
        `- ${event.title} (${event.locationCity}, ${event.locationCountry}) - ${event.startDate}`
      );
    });

    // Show draft events
    const draftEvents = allEvents.filter((e) => e.status === "DRAFT");
    console.log(`\nDraft events (${draftEvents.length}):`);
    draftEvents.forEach((event) => {
      console.log(
        `- ${event.title} (${event.locationCity}, ${event.locationCountry}) - ${event.startDate}`
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents();
