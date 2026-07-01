import { requireAuthSession } from "@/lib/auth-server";
import { listCustomerOrders } from "@/lib/orders/service";
import AccountPageShell from "@/components/account/AccountPageShell";
import AccountPageHeader from "@/components/account/AccountPageHeader";
import OrdersListView from "@/components/orders/OrdersListView";

export default async function AccountOrdersPage() {
  const { user } = await requireAuthSession("/account/orders");
  let initialOrders: Awaited<ReturnType<typeof listCustomerOrders>> = [];

  try {
    initialOrders = await listCustomerOrders(user.id);
  } catch (error) {
    console.error("ACCOUNT_ORDERS_PAGE_ERROR:", error);
  }

  return (
    <AccountPageShell>
      <AccountPageHeader
        backHref="/account"
        backLabel="Account"
        title="My orders"
        description="Follow every step from confirmation to delivery."
      />
      <OrdersListView initialOrders={initialOrders} />
    </AccountPageShell>
  );
}
