import { EventCreateSchema } from "@/lib/validations/event";

describe("EventCreateSchema", () => {
  it("validates required dates and title", () => {
    const now = new Date();
    const later = new Date(now.getTime() + 86400000);
    const parsed = EventCreateSchema.parse({
      slug: "u2-live-la-paz",
      title: "U2 Live",
      artistOrEvent: "U2",
      startDate: now.toISOString(),
      endDate: later.toISOString(),
      status: "DRAFT",
    });
    expect(parsed.title).toBe("U2 Live");
  });
});
