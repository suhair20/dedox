"use client";

export const PRICE_SLIDER_MIN = 0;
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
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  const atMax = value >= PRICE_SLIDER_MAX;
  const progress =
    ((value - PRICE_SLIDER_MIN) / (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
        <span>AED {PRICE_SLIDER_MIN}</span>
        <span>AED {PRICE_SLIDER_MAX.toLocaleString()}+</span>
      </div>

      <div className="relative px-1 py-4">
        <div className="pointer-events-none absolute left-1 right-1 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#7a0c0c]"
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
          className="price-slider relative z-10 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
