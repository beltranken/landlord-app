const CURRENCY_SIGN = "₱";

export interface FormatMoneyOptions {
  locale?: string;
  currency?: string;
  showCurrency?: boolean;
  fallback?: string;
}

export function formatMoney(
  value: number | string | null | undefined,
  {
    locale = "en-US",
    currency = "USD",
    showCurrency = true,
    fallback,
  }: FormatMoneyOptions = {}
): string {
  const num = typeof value === "string" ? Number(value) : value ?? 0;
  if (!isFinite(num)) {
    return fallback ?? (showCurrency ? CURRENCY_SIGN + "0.00" : "0.00");
  }

  // Use Intl for proper grouping & symbol.
  const formatter = new Intl.NumberFormat(locale, {
    style: showCurrency ? "currency" : "decimal",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (!showCurrency) {
    return formatter.format(num);
  }
  return formatter.format(num);
}

export const money = formatMoney;

export default formatMoney;
