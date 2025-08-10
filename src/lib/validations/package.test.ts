import { PackageCreateSchema } from "@/lib/validations/package";

describe("PackageCreateSchema", () => {
  it("parses required fields and arrays", () => {
    const parsed = PackageCreateSchema.parse({
      slug: "rio-carnival-5d4n",
      title: "Rio Carnival 5D4N",
      inclusions: ["Hotel", "Breakfast"],
      exclusions: [],
      isCustom: false,
    });
    expect(parsed.slug).toBe("rio-carnival-5d4n");
    expect(Array.isArray(parsed.inclusions)).toBe(true);
  });

  it("rejects invalid currency and price", () => {
    expect(() =>
      PackageCreateSchema.parse({ slug: "x", title: "Y", currency: "XXX" })
    ).toThrow();
    expect(() =>
      PackageCreateSchema.parse({ slug: "x", title: "Y", fromPrice: -1 })
    ).toThrow();
  });
});
