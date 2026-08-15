import type { Metadata } from "next";
import SignatureView from "@/components/about/SignatureView";

export const metadata: Metadata = {
  title: "Signature",
  description:
    "The Dedox signature — a UAE house of original luxury fragrance, curated for presence and this climate.",
};

export default function SignaturePage() {
  return <SignatureView />;
}
