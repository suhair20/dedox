"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function WriteReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted?: () => void;
}) {
  const { user } = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          authorName: authorName || user?.contact || "Customer",
          authorEmail: user?.email || "",
          rating,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not send review.");
        return;
      }
      setStatus("done");
      setMessage(data.message || "Thank you. Your review will appear after approval.");
      setBody("");
      onSubmitted?.();
    } catch {
      setStatus("error");
      setMessage("Could not send review.");
    }
  };

  if (status === "done") {
    return (
      <p className="rounded-2xl border border-[#7a0c0c]/15 bg-[#7a0c0c]/[0.04] px-4 py-4 text-sm text-gray-700">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Write a review</h3>
      <p className="mt-1 text-xs text-gray-500">
        Reviews are checked before they appear on the site.
      </p>

      <div className="mt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              aria-label={`${star} stars`}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hover || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Your name
        </span>
        <input
          required
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#7a0c0c]"
          placeholder="Name shown with your review"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Your review
        </span>
        <textarea
          required
          minLength={8}
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#7a0c0c]"
          placeholder="How does it smell, last, and wear?"
        />
      </label>

      {message && status === "error" ? (
        <p className="mt-3 text-sm text-red-600">{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "saving"}
        className="btn-primary mt-4 rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest disabled:opacity-60"
      >
        {status === "saving" ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
