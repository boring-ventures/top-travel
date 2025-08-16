import { buildWhatsAppUrl } from "@/lib/utils";
import { isValidImageUrl, filterValidImageUrls } from './utils';

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

describe('isValidImageUrl', () => {
  test('should return true for valid HTTP URLs', () => {
    expect(isValidImageUrl('http://example.com/image.jpg')).toBe(true);
    expect(isValidImageUrl('https://images.unsplash.com/photo-123')).toBe(true);
    expect(isValidImageUrl('https://example.com/image.png?size=large')).toBe(true);
  });

  test('should return false for invalid values', () => {
    expect(isValidImageUrl('1')).toBe(false);
    expect(isValidImageUrl('0')).toBe(false);
    expect(isValidImageUrl('')).toBe(false);
    expect(isValidImageUrl('null')).toBe(false);
    expect(isValidImageUrl('undefined')).toBe(false);
    expect(isValidImageUrl(null)).toBe(false);
    expect(isValidImageUrl(undefined)).toBe(false);
  });

  test('should return false for invalid URLs', () => {
    expect(isValidImageUrl('not-a-url')).toBe(false);
    expect(isValidImageUrl('ftp://example.com/image.jpg')).toBe(false);
    expect(isValidImageUrl('file:///path/to/image.jpg')).toBe(false);
  });
});

describe('filterValidImageUrls', () => {
  test('should filter out items with invalid image URLs', () => {
    const items = [
      { id: '1', heroImageUrl: 'https://example.com/image1.jpg' },
      { id: '2', heroImageUrl: '1' },
      { id: '3', heroImageUrl: 'https://example.com/image3.jpg' },
      { id: '4', heroImageUrl: '' },
      { id: '5', heroImageUrl: null },
    ];

    const result = filterValidImageUrls(items, 'heroImageUrl');
    
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
  });

  test('should handle empty array', () => {
    const result = filterValidImageUrls([], 'heroImageUrl');
    expect(result).toHaveLength(0);
  });
});
