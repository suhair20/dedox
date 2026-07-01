import { notFound } from "next/navigation";
import { requireAuthSession } from "@/lib/auth-server";
import { getCustomerOrder } from "@/lib/orders/service";
import AccountPageShell from "@/components/account/AccountPageShell";
import AccountPageHeader from "@/components/account/AccountPageHeader";
import OrderDetailView from "@/components/orders/OrderDetailView";

type PageProps = {
  params: { id: string };
};

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const { user } = await requireAuthSession(`/account/orders/${params.id}`);
  const initialOrder = await getCustomerOrder(user.id, params.id);

  if (!initialOrder) {
    notFound();
  }

  return (
    <AccountPageShell>
      <AccountPageHeader backHref="/account/orders" backLabel="All orders" />
      <OrderDetailView orderId={params.id} initialOrder={initialOrder} />
    </AccountPageShell>
  );
}
