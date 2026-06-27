import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAuthSession } from "@/lib/auth-server";
import OrdersListView from "@/components/orders/OrdersListView";

export default async function AccountOrdersPage() {
  await requireAuthSession("/account/orders");

  return (
    <div className="min-h-screen bg-[#faf7fb] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-gray-400 transition hover:text-[#7a0c0c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Account
          </Link>
          <h1 className="mt-4 font-serif-luxury text-4xl font-bold tracking-tight text-gray-900">
            My Orders
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Track your purchases and watch status updates live as we prepare your order.
          </p>
        </div>

        <OrdersListView />
      </div>
    </div>
  );
}
