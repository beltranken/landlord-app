export default function getCurrencySign(currency: string) {
  switch (currency.toLowerCase()) {
    case "php":
      return "₱";
    case "usd":
      return "$";
    case "eur":
      return "€";
    default:
      return currency;
  }
}
