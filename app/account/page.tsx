import { Mail, MapPin, Package, ShoppingBag, Sparkles } from "lucide-react";
import { requireAuthSession } from "@/lib/auth-server";
import { listCustomerOrders } from "@/lib/orders/service";
import AccountPageShell from "@/components/account/AccountPageShell";
import AccountOverview from "@/components/account/AccountOverview";
import AccountNavCard from "@/components/account/AccountNavCard";
import LogoutButton from "@/components/LogoutButton";

function getInitial(contact: string) {
  const base = contact.trim().charAt(0).toUpperCase();
  return base || "D";
}

export default async function AccountPage() {
  const { user } = await requireAuthSession("/account");
  const initial = getInitial(user.contact);

  let orders: Awaited<ReturnType<typeof listCustomerOrders>> = [];
  try {
    orders = await listCustomerOrders(user.id);
  } catch (error) {
    console.error("ACCOUNT_PAGE_ORDERS_ERROR:", error);
  }

  const orderCount = orders.length;
  const activeOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase();
    return status && status !== "delivered" && status !== "cancelled";
  }).length;

  return (
    <AccountPageShell>
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-6">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7a0c0c] via-[#6b0a0a] to-[#4a0606] px-5 py-6 text-white shadow-[0_24px_60px_rgba(122,12,12,0.28)] sm:rounded-[32px] sm:px-7 sm:py-8 lg:col-span-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/4 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl font-bold backdrop-blur-sm sm:h-16 sm:w-16 sm:text-2xl">
              {initial}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Member
              </div>
              <h1 className="mt-3 font-serif-luxury text-2xl font-bold tracking-tight sm:text-3xl">
                Your account
              </h1>
              <p className="mt-2 flex items-center gap-2 break-all text-sm text-white/75">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {user.contact}
              </p>
            </div>
          </div>
        </section>

        <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-center">
          <AccountOverview orderCount={orderCount} activeOrders={activeOrders} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        <AccountNavCard
          href="/account/orders"
          icon={Package}
          title="My orders"
          description="Track deliveries and order history"
          featured
        />
        <AccountNavCard
          href="/account/addresses"
          icon={MapPin}
          title="Saved addresses"
          description="Manage home, office, and delivery locations"
        />
        <AccountNavCard
          href="/shop"
          icon={ShoppingBag}
          title="Explore collection"
          description="Discover luxury fragrances curated for you"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5 lg:mt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start justify-between gap-4 sm:items-center lg:justify-start">
            <div>
              <p className="text-sm font-medium text-gray-900">Signed in</p>
              <p className="mt-0.5 text-xs text-gray-500">
                Secure access to your orders and checkout
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 lg:ml-4">
              Active
            </span>
          </div>
          <LogoutButton className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:px-6" />
        </div>
      </div>
    </AccountPageShell>
  );
}
