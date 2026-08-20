import type { Metadata } from "next";
import ReviewsView from "./ReviewsView";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Read customer reviews of luxury fragrances from dedoxperfume. Verified purchases and real notes from wearers.",
  alternates: { canonical: `${SITE_URL}/reviews` },
};

export default function ReviewsPage() {
  return <ReviewsView />;
}
