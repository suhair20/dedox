import "server-only";

import { randomUUID } from "crypto";
import { client, getSanityWriteClient } from "@/lib/sanity";
import type { ShippingAddressInput } from "@/lib/checkout/types";
import { addressesMatch } from "./validation";
import type { SavedAddress, SavedAddressInput } from "./types";

export { savedAddressToShippingInput } from "./utils";

type UserAddressesDoc = {
  _id: string;
  savedAddresses?: SavedAddress[];
};

function toSanityAddress(
  input: SavedAddressInput,
  key: string
): SavedAddress {
  return {
    _key: key,
    _type: "savedAddress",
    label: input.label?.trim() || undefined,
    isDefault: Boolean(input.isDefault),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    country: input.country.trim(),
    city: input.city.trim(),
    postalCode: input.postalCode?.trim() || undefined,
    streetAddress: input.streetAddress.trim(),
  };
}

function normalizeDefaults(addresses: SavedAddress[]) {
  if (addresses.length === 0) return addresses;

  const hasDefault = addresses.some((a) => a.isDefault);
  if (!hasDefault) {
    return addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }

  let found = false;
  return addresses.map((a) => {
    if (a.isDefault && !found) {
      found = true;
      return a;
    }
    return { ...a, isDefault: false };
  });
}

async function getUserAddressesDoc(
  userId: string
): Promise<UserAddressesDoc | null> {
  return client.fetch<UserAddressesDoc | null>(
    `*[_type == "user" && _id == $userId][0]{ _id, savedAddresses }`,
    { userId }
  );
}

export async function listSavedAddresses(
  userId: string
): Promise<SavedAddress[]> {
  const doc = await getUserAddressesDoc(userId);
  const addresses = doc?.savedAddresses ?? [];
  return normalizeDefaults([...addresses]);
}

export async function upsertSavedAddress(
  userId: string,
  input: SavedAddressInput,
  existingKey?: string
): Promise<SavedAddress[]> {
  const writeClient = getSanityWriteClient();
  const doc = await getUserAddressesDoc(userId);
  if (!doc?._id) throw new Error("User not found.");

  let addresses = [...(doc.savedAddresses ?? [])];
  const key = existingKey || randomUUID();

  const next = toSanityAddress(input, key);

  const duplicateIndex = addresses.findIndex(
    (a) => a._key !== key && addressesMatch(a, next)
  );
  if (duplicateIndex >= 0) {
    addresses.splice(duplicateIndex, 1);
  }

  const index = addresses.findIndex((a) => a._key === key);
  if (index >= 0) {
    addresses[index] = next;
  } else {
    addresses.push(next);
  }

  if (input.isDefault || addresses.length === 1) {
    addresses = addresses.map((a) => ({
      ...a,
      isDefault: a._key === key,
    }));
  }

  addresses = normalizeDefaults(addresses);

  await writeClient.patch(doc._id).set({ savedAddresses: addresses }).commit();
  return addresses;
}

export async function deleteSavedAddress(
  userId: string,
  addressKey: string
): Promise<SavedAddress[]> {
  const writeClient = getSanityWriteClient();
  const doc = await getUserAddressesDoc(userId);
  if (!doc?._id) throw new Error("User not found.");

  let addresses = (doc.savedAddresses ?? []).filter(
    (a) => a._key !== addressKey
  );
  addresses = normalizeDefaults(addresses);

  await writeClient.patch(doc._id).set({ savedAddresses: addresses }).commit();
  return addresses;
}

export async function setDefaultSavedAddress(
  userId: string,
  addressKey: string
): Promise<SavedAddress[]> {
  const writeClient = getSanityWriteClient();
  const doc = await getUserAddressesDoc(userId);
  if (!doc?._id) throw new Error("User not found.");

  const addresses = normalizeDefaults(
    (doc.savedAddresses ?? []).map((a) => ({
      ...a,
      isDefault: a._key === addressKey,
    }))
  );

  await writeClient.patch(doc._id).set({ savedAddresses: addresses }).commit();
  return addresses;
}

/** Save checkout address if new or explicitly requested. */
export async function maybeSaveCheckoutAddress(
  userId: string,
  address: ShippingAddressInput,
  options?: { saveAddress?: boolean; label?: string }
) {
  if (!options?.saveAddress) {
    const existing = await listSavedAddresses(userId);
    const match = existing.find((a) => addressesMatch(a, address));
    if (match) return existing;
    return existing;
  }

  const existing = await listSavedAddresses(userId);
  const match = existing.find((a) => addressesMatch(a, address));

  return upsertSavedAddress(userId, {
    ...address,
    label: options.label?.trim() || match?.label || "Home",
    isDefault: existing.length === 0 || match?.isDefault || false,
  }, match?._key);
}

