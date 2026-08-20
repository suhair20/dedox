"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { StoreReview } from "@/lib/reviews";
import StarRating from "@/components/reviews/StarRating";

export default function ReviewsView() {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [star, setStar] = useState(0);

  useEffect(() => {
    fetch("/api/reviews?limit=100")
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data.reviews) ? data.reviews : []))
      .catch(() => setReviews([]));
  }, []);

  const visible = useMemo(
    () => (star ? reviews.filter((review) => Math.round(review.rating) === star) : reviews),
    [reviews, star]
  );

  const average =
    reviews.length === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length) * 10
        ) / 10;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="font-serif-luxury text-3xl font-bold text-[#7a0c0c] sm:text-5xl">
          Customer Love
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          {reviews.length === 0
            ? "Reviews will appear here after customers share them."
            : `${average.toFixed(1)} / 5 from ${reviews.length} published review${reviews.length === 1 ? "" : "s"}.`}
        </p>

        {reviews.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStar(0)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
                star === 0 ? "bg-[#7a0c0c] text-white" : "border border-gray-200 text-gray-500"
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStar(n)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
                  star === n ? "bg-[#7a0c0c] text-white" : "border border-gray-200 text-gray-500"
                }`}
              >
                {n}★
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-10 space-y-4">
          {visible.map((review) => (
            <article key={review.id} className="rounded-2xl border border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                {review.productImage ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={review.productImage}
                      alt={review.productName || "Perfume"}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-grow">
                  <StarRating value={review.rating} />
                  {review.productId ? (
                    <Link
                      href={`/product/${review.productId}`}
                      className="mt-1 block text-sm font-bold text-[#7a0c0c]"
                    >
                      {review.productName}
                    </Link>
                  ) : null}
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{review.body}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    — {review.authorName}
                    {review.verifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 font-bold uppercase tracking-widest text-[#7a0c0c]">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified purchase
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
