"use client";

import { useLocation } from "@/context/LocationContext";

export const PRICE_SLIDER_MIN = 300;
export const PRICE_SLIDER_MAX = 2000;
export const PRICE_SLIDER_STEP = 50;

export function formatAed(amount: number) {
  return `AED ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default function PriceRangeSlider({
  value,
  onChange,
  label = "Shop by price",
  light = false,
  red = false,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  light?: boolean;
  red?: boolean;
}) {
  const { formatPrice } = useLocation();
  const progress =
    ((value - PRICE_SLIDER_MIN) / (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) * 100;

  return (
    <div>
      <div
        className={`mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs ${
          red
            ? "text-[#7a0c0c]"
            : light
              ? "text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
              : "text-gray-500"
        }`}
      >
        <span>{formatPrice(PRICE_SLIDER_MIN)}</span>
        <span>{formatPrice(PRICE_SLIDER_MAX)}+</span>
      </div>

      <div className="relative px-1 py-4">
        <div
          className={`pointer-events-none absolute left-1 right-1 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full ${
            light ? "bg-white/35" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-full rounded-full ${light ? "bg-white" : "bg-[#7a0c0c]"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min={PRICE_SLIDER_MIN}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          className={`price-slider relative z-10 w-full cursor-pointer appearance-none bg-transparent ${
            light ? "price-slider-light" : ""
          }`}
        />
      </div>
    </div>
  );
}
