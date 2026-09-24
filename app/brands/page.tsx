import type { Metadata } from "next";
import BrandsView from "@/components/brands/BrandsView";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Brands",
  description: `Browse every fragrance house at ${SITE_NAME}. Tap a brand to shop that collection.`,
  alternates: {
    canonical: `${SITE_URL}/brands`,
  },
  openGraph: {
    title: `All Brands | ${SITE_NAME}`,
    description: `Browse every fragrance house at ${SITE_NAME}.`,
    url: `${SITE_URL}/brands`,
  },
};

export default function BrandsPage() {
  return <BrandsView />;
}
