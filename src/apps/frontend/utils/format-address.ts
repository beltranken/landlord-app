import { OptionalAddress } from "@/validations";

export default function formatAddress(address: OptionalAddress) {
  if (!address) {
    return "";
  }

  const { address1, address2, city, state, postalCode, country } = address;

  const line1Parts = [address1, address2].filter(Boolean);
  const line2Parts = [city, state, postalCode].filter(Boolean);

  const parts = [line1Parts.join(", "), line2Parts.join(" "), country].filter(
    (part) => part && part.trim().length > 0,
  );

  return parts.join(", ");
}
