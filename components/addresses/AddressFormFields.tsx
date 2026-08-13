"use client";

import type { ShippingAddressInput } from "@/lib/checkout/types";
import {
  SHIPPING_COUNTRIES,
} from "@/lib/locale/countries";

type AddressFormFieldsProps = {
  value: ShippingAddressInput;
  onChange: (value: ShippingAddressInput) => void;
  showContact?: boolean;
  labelValue?: string;
  onLabelChange?: (label: string) => void;
};

export default function AddressFormFields({
  value,
  onChange,
  showContact = true,
  labelValue,
  onLabelChange,
}: AddressFormFieldsProps) {
  const update = (patch: Partial<ShippingAddressInput>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      {onLabelChange ? (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Address label
          </label>
          <input
            type="text"
            value={labelValue || ""}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Home, Office, Other"
            className="form-input"
          />
        </div>
      ) : null}

      {showContact ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={value.email}
              onChange={(e) => update({ email: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={value.phone || ""}
              onChange={(e) => update({ phone: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            type="text"
            value={value.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            type="text"
            value={value.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            value={value.country}
            onChange={(e) => update({ country: e.target.value })}
            className="form-select"
            required
          >
            {SHIPPING_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            value={value.city}
            onChange={(e) => update({ city: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ZIP / Post code
          </label>
          <input
            type="text"
            value={value.postalCode || ""}
            onChange={(e) => update({ postalCode: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Street address
          </label>
          <textarea
            rows={3}
            value={value.streetAddress}
            onChange={(e) => update({ streetAddress: e.target.value })}
            className="form-textarea"
            required
          />
        </div>
      </div>
    </div>
  );
}
