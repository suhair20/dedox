import { requireAuthSession } from "@/lib/auth-server";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  await requireAuthSession("/checkout");

  return <CheckoutClient />;
}
