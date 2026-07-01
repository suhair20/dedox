import type { ShippingAddressInput } from "@/lib/checkout/types";

export type SavedAddress = ShippingAddressInput & {
  _key: string;
  _type?: "savedAddress";
  label?: string;
  isDefault?: boolean;
};

export type SavedAddressInput = ShippingAddressInput & {
  label?: string;
  isDefault?: boolean;
};

export type SavedAddressPayload = SavedAddressInput & {
  _key?: string;
};
