import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAuthSession } from "@/lib/auth-server";
import OrderDetailView from "@/components/orders/OrderDetailView";

type PageProps = {
  params: { id: string };
};

export default async function AccountOrderDetailPage({ params }: PageProps) {
  await requireAuthSession(`/account/orders/${params.id}`);

  return (
    <div className="min-h-screen bg-[#faf7fb] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-gray-400 transition hover:text-[#7a0c0c]"
        >
          <ArrowLeft className="h-4 w-4" />
          All orders
        </Link>

        <OrderDetailView orderId={params.id} />
      </div>
    </div>
  );
}
