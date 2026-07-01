import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div className="rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-sm">
      <p className="text-lg font-bold text-gray-900">Order not found.</p>
      <Link
        href="/account/orders"
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7a0c0c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>
    </div>
  );
}
