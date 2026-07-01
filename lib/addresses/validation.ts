import type { ShippingAddressInput } from "@/lib/checkout/types";

export { formatAddressLine, getAddressDisplayName } from "./utils";

export function validateAddressInput(
  address: Partial<ShippingAddressInput> | null | undefined
): address is ShippingAddressInput {
  return Boolean(
    address?.email?.trim() &&
      address.firstName?.trim() &&
      address.lastName?.trim() &&
      address.country?.trim() &&
      address.city?.trim() &&
      address.streetAddress?.trim()
  );
}

export function addressesMatch(
  a: ShippingAddressInput,
  b: ShippingAddressInput
) {
  return (
    a.email.trim().toLowerCase() === b.email.trim().toLowerCase() &&
    (a.phone || "").trim() === (b.phone || "").trim() &&
    a.firstName.trim().toLowerCase() === b.firstName.trim().toLowerCase() &&
    a.lastName.trim().toLowerCase() === b.lastName.trim().toLowerCase() &&
    a.country.trim().toLowerCase() === b.country.trim().toLowerCase() &&
    a.city.trim().toLowerCase() === b.city.trim().toLowerCase() &&
    (a.postalCode || "").trim().toLowerCase() ===
      (b.postalCode || "").trim().toLowerCase() &&
    a.streetAddress.trim().toLowerCase() === b.streetAddress.trim().toLowerCase()
  );
}
