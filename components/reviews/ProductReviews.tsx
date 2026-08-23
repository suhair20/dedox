"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import type { StoreReview } from "@/lib/reviews";
import { ratingBreakdown } from "@/lib/reviews";
import StarRating from "@/components/reviews/StarRating";
import WriteReviewForm from "@/components/reviews/WriteReviewForm";

export default function ProductReviews({
  productId,
  rating,
  reviewCount,
}: {
  productId: string;
  rating?: number;
  reviewCount?: number;
}) {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}&limit=50`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data.reviews) ? data.reviews : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const count = reviews.length || reviewCount || 0;
  const average =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length) * 10
        ) / 10
      : rating || 0;
  const breakdown = useMemo(() => ratingBreakdown(reviews), [reviews]);

  return (
    <section
      id="reviews"
      className="scroll-mt-28 rounded-3xl border border-[#7a0c0c]/15 bg-white p-5 shadow-[0_12px_40px_rgba(122,12,12,0.08)] sm:p-8"
    >
      <h2 className="font-serif-luxury text-2xl font-bold text-gray-900 sm:text-3xl">
        Customer Reviews
      </h2>

      {count === 0 ? (
        <p className="mt-3 text-sm text-gray-500">Be the first to review this fragrance.</p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
          <div>
            <p className="font-serif-luxury text-5xl font-bold text-[#7a0c0c]">{average.toFixed(1)}</p>
            <StarRating value={average} size="md" className="mt-2" />
            <p className="mt-2 text-sm text-gray-500">
              {count} review{count === 1 ? "" : "s"}
            </p>
            <div className="mt-5 space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const n = breakdown[star];
                const pct = count ? Math.round((n / count) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-6">{star}★</span>
                    <div className="h-1.5 flex-grow overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full bg-[#7a0c0c]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400">Loading reviews…</p>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating value={review.rating} />
                    {review.verifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#7a0c0c]">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified purchase
                      </span>
                    ) : null}
                  </div>
                  {review.title ? (
                    <h3 className="mt-2 text-sm font-bold text-gray-900">{review.title}</h3>
                  ) : null}
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.body}</p>
                  <p className="mt-3 text-xs text-gray-400">— {review.authorName}</p>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <WriteReviewForm productId={productId} onSubmitted={load} />
      </div>
    </section>
  );
}
