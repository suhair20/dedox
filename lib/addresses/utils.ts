import type { ShippingAddressInput } from "@/lib/checkout/types";
import type { SavedAddress, SavedAddressInput } from "./types";

export function savedAddressToShippingInput(
  address: SavedAddress
): ShippingAddressInput {
  return {
    email: address.email,
    phone: address.phone,
    firstName: address.firstName,
    lastName: address.lastName,
    country: address.country,
    city: address.city,
    postalCode: address.postalCode,
    streetAddress: address.streetAddress,
  };
}

export function formatAddressLine(address: ShippingAddressInput) {
  const parts = [
    address.streetAddress,
    address.city,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
}

export function getAddressDisplayName(address: SavedAddressInput) {
  if (address.label?.trim()) return address.label.trim();
  return `${address.firstName} ${address.lastName}`.trim() || "Address";
}
