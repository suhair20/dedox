"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import type { ShippingAddressInput } from "@/lib/checkout/types";
import type { SavedAddress } from "@/lib/addresses/types";
import { savedAddressToShippingInput } from "@/lib/addresses/utils";
import { formatAddressLine, getAddressDisplayName } from "@/lib/addresses/utils";
import AddressFormFields from "@/components/addresses/AddressFormFields";

type ShippingAddressSectionProps = {
  shippingAddress: ShippingAddressInput;
  setShippingAddress: (value: ShippingAddressInput) => void;
  saveAddress: boolean;
  setSaveAddress: (value: boolean) => void;
  addressLabel: string;
  setAddressLabel: (value: string) => void;
  isAuthenticated: boolean;
};

export default function ShippingAddressSection({
  shippingAddress,
  setShippingAddress,
  saveAddress,
  setSaveAddress,
  addressLabel,
  setAddressLabel,
  isAuthenticated,
}: ShippingAddressSectionProps) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(isAuthenticated);
  const [mode, setMode] = useState<"saved" | "new">("new");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setMode("new");
      return;
    }

    fetch("/api/account/addresses", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedAddress[]) => {
        const list = Array.isArray(data) ? data : [];
        setAddresses(list);

        if (list.length > 0) {
          const defaultAddress =
            list.find((a) => a.isDefault) || list[0];
          setMode("saved");
          setSelectedKey(defaultAddress._key);
          setShippingAddress(savedAddressToShippingInput(defaultAddress));
        } else {
          setMode("new");
        }
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, setShippingAddress]);

  const selectSaved = (address: SavedAddress) => {
    setMode("saved");
    setSelectedKey(address._key);
    setShippingAddress(savedAddressToShippingInput(address));
    setSaveAddress(false);
  };

  const useNewAddress = () => {
    setMode("new");
    setSelectedKey(null);
    setSaveAddress(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#7a0c0c]/15 border-t-[#7a0c0c]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAuthenticated && addresses.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Saved addresses
            </h3>
            <button
              type="button"
              onClick={useNewAddress}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a0c0c] hover:text-[#981212]"
            >
              <Plus className="h-3.5 w-3.5" />
              New address
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((address) => {
              const selected = mode === "saved" && selectedKey === address._key;
              return (
                <button
                  key={address._key}
                  type="button"
                  onClick={() => selectSaved(address)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#7a0c0c] bg-[#7a0c0c]/5 shadow-sm ring-1 ring-[#7a0c0c]/20"
                      : "border-gray-200 bg-white hover:border-[#7a0c0c]/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-[#7a0c0c] bg-[#7a0c0c]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selected ? (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {getAddressDisplayName(address)}
                        </p>
                        {address.isDefault ? (
                          <span className="rounded-full bg-[#7a0c0c]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7a0c0c]">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {address.firstName} {address.lastName}
                        {address.phone ? ` · ${address.phone}` : ""}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        {formatAddressLine(address)}
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 shrink-0 text-[#7a0c0c]/60" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {mode === "new" || !isAuthenticated || addresses.length === 0 ? (
        <section className="space-y-4">
          {isAuthenticated && addresses.length > 0 ? (
            <h3 className="text-sm font-semibold text-gray-900">
              Deliver to a different address
            </h3>
          ) : null}

          <AddressFormFields
            value={shippingAddress}
            onChange={setShippingAddress}
            labelValue={addressLabel}
            onLabelChange={isAuthenticated ? setAddressLabel : undefined}
          />

          {isAuthenticated ? (
            <label className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#fafafa] p-4">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#7a0c0c] focus:ring-[#7a0c0c]"
              />
              <span className="text-sm text-gray-600">
                Save this address for future orders
              </span>
            </label>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
