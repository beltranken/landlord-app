const CURRENCY_SIGN = "₱";

export interface FormatMoneyOptions {
  locale?: string;
  currency?: string;
  showCurrency?: boolean;
  fallback?: string;
  decimalPlaces?: {
    min?: number;
    max?: number;
  };
}

export function formatMoney(
  value: number | string | null | undefined,
  {
    locale = "en-US",
    currency = "PHP",
    showCurrency = true,
    fallback,
    decimalPlaces = { min: 2, max: 2 },
  }: FormatMoneyOptions = {},
): string {
  const { min = 0, max = 0 } = decimalPlaces;

  const num = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!isFinite(num)) {
    const zeroStr = "0" + (min > 0 ? "." + "0".repeat(min) : "");

    return fallback ?? (showCurrency ? CURRENCY_SIGN + zeroStr : zeroStr);
  }

  // Use Intl for proper grouping & symbol.
  const formatter = new Intl.NumberFormat(locale, {
    style: showCurrency ? "currency" : "decimal",
    currency,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });

  const formatted = formatter.format(num);

  return formatted;
}

export const money = formatMoney;

export default formatMoney;
