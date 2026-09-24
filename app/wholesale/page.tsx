import type { Metadata } from "next";
import WholesaleView from "@/components/wholesale/WholesaleView";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wholesale",
  description: `Wholesale and reseller perfume supply from ${SITE_NAME}. Contact us on WhatsApp for partner pricing.`,
  alternates: {
    canonical: `${SITE_URL}/wholesale`,
  },
  openGraph: {
    title: `Wholesale | ${SITE_NAME}`,
    description: `Wholesale and reseller perfume supply from ${SITE_NAME}. Contact us on WhatsApp for partner pricing.`,
    url: `${SITE_URL}/wholesale`,
  },
};

export default function WholesalePage() {
  return <WholesaleView />;
}
