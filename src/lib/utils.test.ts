import { buildWhatsAppUrl } from "@/lib/utils";

describe("buildWhatsAppUrl", () => {
  it("replaces template variables and encodes message", () => {
    const url = buildWhatsAppUrl("59170000000", "Hola! Me interesa {title}.", {
      title: "Paquete Río",
    });
    expect(url).toContain("https://wa.me/59170000000");
    const text = new URL(url).searchParams.get("text");
    expect(text).toContain("Hola! Me interesa Paquete Río.");
  });

  it("appends UTM reference with page URL when provided", () => {
    const url = buildWhatsAppUrl(
      "59170000000",
      "Hola {title}",
      { title: "Río" },
      {
        utm: {
          source: "ads",
          medium: "cpc",
          campaign: "summer",
          content: "hero",
        },
        pageUrl: "https://example.com/packages/rio",
      }
    );
    const text = new URL(url).searchParams.get("text")!;
    expect(text).toContain("Hola Río");
    expect(text).toContain(
      "Ref: https://example.com/packages/rio?utm_source=ads&utm_medium=cpc&utm_campaign=summer&utm_content=hero"
    );
  });
});
