import { OfferCreateSchema } from "@/lib/validations/offer";

describe("OfferCreateSchema", () => {
  it("accepts minimal valid payload", () => {
    const data = {
      title: "Black Friday",
      status: "DRAFT",
    };
    const parsed = OfferCreateSchema.parse(data);
    expect(parsed.title).toBe("Black Friday");
    expect(parsed.isFeatured ?? false).toBe(false);
  });

  it("rejects invalid banner URL", () => {
    expect(() =>
      OfferCreateSchema.parse({ title: "X", bannerImageUrl: "not-a-url" })
    ).toThrow();
  });
});
