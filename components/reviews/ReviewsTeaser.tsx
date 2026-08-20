"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StoreReview } from "@/lib/reviews";
import StarRating from "@/components/reviews/StarRating";

export default function ReviewsTeaser() {
  const [reviews, setReviews] = useState<StoreReview[]>([]);

  useEffect(() => {
    fetch("/api/reviews?featured=1&limit=5")
      .then((res) => res.json())
      .then((data) => {
        const featured = Array.isArray(data.reviews) ? data.reviews : [];
        if (featured.length > 0) {
          setReviews(featured.slice(0, 5));
          return;
        }
        return fetch("/api/reviews?limit=5")
          .then((res) => res.json())
          .then((fallback) => setReviews(Array.isArray(fallback.reviews) ? fallback.reviews : []));
      })
      .catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="home-section">
      <div className="home-section-inner">
        <div className="home-section-header">
          <h2 className="home-section-title">What Our Customers Say</h2>
          <p className="home-section-subtitle">
            Selected notes from clients who bought and wore the bottle.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 5).map((review) => (
            <blockquote
              key={review.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <StarRating value={review.rating} size="md" />
              <p className="mt-4 text-sm leading-relaxed text-gray-700">“{review.body}”</p>
              <footer className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                — {review.verifiedPurchase ? "Verified Customer" : review.authorName}
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/reviews"
            className="inline-flex rounded-full border border-[#7a0c0c]/20 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-[#7a0c0c]"
          >
            View all reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
