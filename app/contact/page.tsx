import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to Dedox Perfume — questions about bottles, orders, and Rewards.",
};

export default function ContactPage() {
  return <ContactView />;
}
