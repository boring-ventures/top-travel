import prisma from "@/lib/prisma";

export default async function DebugEventsPage() {
  // Get all events without any filters
  const allEvents = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      startDate: true,
      endDate: true,
      locationCity: true,
      locationCountry: true,
      slug: true,
    },
  });

  // Get published events only
  const publishedEvents = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      status: true,
      startDate: true,
      endDate: true,
      locationCity: true,
      locationCountry: true,
      slug: true,
    },
    orderBy: { startDate: "asc" },
    take: 50,
  });

  // Get events with the same logic as the events page
  const eventsPageLogic = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: { startDate: "asc" },
    take: 50,
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            All Events ({allEvents.length})
          </h2>
          <div className="space-y-2">
            {allEvents.map((event) => (
              <div key={event.id} className="bg-white p-3 rounded border">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">
                  Status: {event.status}
                </div>
                <div className="text-sm text-gray-600">
                  {event.locationCity}, {event.locationCountry}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Published Events ({publishedEvents.length})
          </h2>
          <div className="space-y-2">
            {publishedEvents.map((event) => (
              <div key={event.id} className="bg-white p-3 rounded border">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">
                  Status: {event.status}
                </div>
                <div className="text-sm text-gray-600">
                  {event.locationCity}, {event.locationCountry}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Events Page Logic ({eventsPageLogic.length})
          </h2>
          <div className="space-y-2">
            {eventsPageLogic.map((event) => (
              <div key={event.id} className="bg-white p-3 rounded border">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">
                  Status: {event.status}
                </div>
                <div className="text-sm text-gray-600">
                  {event.locationCity}, {event.locationCountry}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
