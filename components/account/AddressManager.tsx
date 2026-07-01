"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { SavedAddress } from "@/lib/addresses/types";
import type { ShippingAddressInput } from "@/lib/checkout/types";
import AddressFormFields from "@/components/addresses/AddressFormFields";
import {
  formatAddressLine,
  getAddressDisplayName,
  savedAddressToShippingInput,
} from "@/lib/addresses/utils";

const emptyForm: ShippingAddressInput = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  country: "United Arab Emirates",
  city: "",
  postalCode: "",
  streetAddress: "",
};

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: SavedAddress[];
}) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState<ShippingAddressInput>(emptyForm);
  const [label, setLabel] = useState("Home");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingKey(null);
    setForm(emptyForm);
    setLabel("Home");
    setIsDefault(addresses.length === 0);
    setShowForm(true);
  };

  const openEdit = (address: SavedAddress) => {
    setEditingKey(address._key);
    setForm(savedAddressToShippingInput(address));
    setLabel(address.label || "Home");
    setIsDefault(Boolean(address.isDefault));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingKey(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        label,
        isDefault,
        ...(editingKey ? { _key: editingKey } : {}),
      };

      const res = await fetch(
        editingKey
          ? `/api/account/addresses/${editingKey}`
          : "/api/account/addresses",
        {
          method: editingKey ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editingKey ? { address: payload } : payload
          ),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address.");
      setAddresses(Array.isArray(data) ? data : []);
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm("Delete this address?")) return;
    setError("");
    try {
      const res = await fetch(`/api/account/addresses/${key}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete address.");
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address.");
    }
  };

  const handleSetDefault = async (key: string) => {
    setError("");
    try {
      const res = await fetch(`/api/account/addresses/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setDefault" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update default.");
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update default.");
    }
  };

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!showForm ? (
        <button
          type="button"
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#7a0c0c]/30 bg-[#7a0c0c]/5 px-4 py-4 text-sm font-semibold text-[#7a0c0c] transition hover:bg-[#7a0c0c]/10"
        >
          <Plus className="h-4 w-4" />
          Add new address
        </button>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900">
            {editingKey ? "Edit address" : "Add address"}
          </h2>
          <div className="mt-4 space-y-4">
            <AddressFormFields
              value={form}
              onChange={setForm}
              labelValue={label}
              onLabelChange={setLabel}
            />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#7a0c0c]"
              />
              <span className="text-sm text-gray-600">Set as default address</span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary h-11 flex-1 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save address"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="h-11 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7a0c0c]/8 text-[#7a0c0c]">
            <MapPin className="h-6 w-6" />
          </div>
          <p className="text-sm text-gray-500">
            No saved addresses yet. Add one for faster checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address._key}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
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
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {formatAddressLine(address)}
                  </p>
                  <p className="mt-1 break-all text-xs text-gray-400">
                    {address.email}
                    {address.phone ? ` · ${address.phone}` : ""}
                  </p>
                </div>
                <MapPin className="h-4 w-4 shrink-0 text-[#7a0c0c]/50" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address._key)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:border-[#7a0c0c]/30 hover:text-[#7a0c0c]"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Make default
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:border-[#7a0c0c]/30 hover:text-[#7a0c0c]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address._key)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
