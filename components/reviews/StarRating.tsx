"use client";

import { Star } from "lucide-react";

export default function StarRating({
  value,
  size = "sm",
  className = "",
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const icon = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${icon} ${
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-gray-300"
          }`}
        />
      ))}
    </span>
  );
}
