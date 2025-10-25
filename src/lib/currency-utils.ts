/**
 * Utility functions for currency display
 */

/**
 * Get currency display text (e.g., "USD", "BOB")
 * @param currency - Currency code from database
 * @returns Currency display text
 */
export const getCurrencyDisplay = (
  currency: string | null | undefined
): string => {
  switch (currency) {
    case "BOB":
      return "BOB";
    case "USD":
      return "USD";
    default:
      return "USD"; // Default to USD
  }
};

/**
 * Format price with currency display
 * @param price - Price value
 * @param currency - Currency code
 * @param showFrom - Whether to show "Desde" prefix
 * @returns Formatted price string
 */
export const formatPriceWithCurrency = (
  price: number | string | null | undefined,
  currency: string | null | undefined,
  showFrom: boolean = true
): string => {
  if (!price) return "Consultar precio";

  const currencyDisplay = getCurrencyDisplay(currency);
  const prefix = showFrom ? "Desde " : "";

  return `${prefix}${currencyDisplay} ${price}`;
};
