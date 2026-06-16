import Link from "next/link";
import { Mail, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import { requireAuthSession } from "@/lib/auth-server";
import LogoutButton from "@/components/LogoutButton";

export default async function AccountPage() {
  const { user } = await requireAuthSession("/account");

  return (
    <div className="min-h-screen bg-[#faf7fb] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[36px] bg-[#2E073F] px-8 py-10 text-white shadow-[0_30px_80px_rgba(46,7,63,0.24)] sm:px-12">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-white/60">
            Customer Account
          </p>
          <h1 className="mt-4 font-serif-luxury text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back to Dedox.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
            Your session is active and protected with OTP verification. Use your
            account space to manage future orders, saved details, and checkout
            access.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E073F]/8 text-[#2E073F]">
                {user.channel === "email" ? (
                  <Mail className="h-5 w-5" />
                ) : (
                  <Smartphone className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                  Verified contact
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                  {user.contact}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-gray-100 bg-[#fcfbfd] p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                  Auth method
                </p>
                <p className="mt-3 text-lg font-bold text-gray-900">
                  {user.channel === "email" ? "Email OTP" : "Phone OTP"}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Your login stays active across refreshes until you choose to
                  sign out.
                </p>
              </div>

              <div className="rounded-[26px] border border-gray-100 bg-[#fcfbfd] p-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-[11px] font-black uppercase tracking-[0.28em]">
                    Session status
                  </p>
                </div>
                <p className="mt-3 text-lg font-bold text-gray-900">
                  Protected and active
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Account routes now require a valid backend-verified session.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                Quick actions
              </p>
              <div className="mt-6 space-y-4">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-3 rounded-[22px] bg-[#2E073F] px-6 py-4 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:scale-[1.01]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-3 rounded-[22px] border border-gray-200 px-6 py-4 text-[11px] font-black uppercase tracking-[0.28em] text-gray-900 transition hover:border-[#2E073F] hover:text-[#2E073F]"
                >
                  Checkout
                </Link>
                <LogoutButton className="flex w-full items-center justify-center gap-3 rounded-[22px] border border-red-100 bg-red-50 px-6 py-4 text-[11px] font-black uppercase tracking-[0.28em] text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
            </div>

            <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                What changed
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-500">
                <li>OTP verification now completes against backend persistence.</li>
                <li>Authenticated state is restored from the session cookie.</li>
                <li>Protected account access redirects unauthenticated visitors.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
