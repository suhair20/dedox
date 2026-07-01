import { requireAuthSession } from "@/lib/auth-server";
import { listSavedAddresses } from "@/lib/addresses/service";
import AccountPageShell from "@/components/account/AccountPageShell";
import AccountPageHeader from "@/components/account/AccountPageHeader";
import AddressManager from "@/components/account/AddressManager";

export default async function AccountAddressesPage() {
  const { user } = await requireAuthSession("/account/addresses");
  let initialAddresses: Awaited<ReturnType<typeof listSavedAddresses>> = [];

  try {
    initialAddresses = await listSavedAddresses(user.id);
  } catch (error) {
    console.error("ACCOUNT_ADDRESSES_PAGE_ERROR:", error);
  }

  return (
    <AccountPageShell>
      <AccountPageHeader
        backHref="/account"
        backLabel="Account"
        title="Saved addresses"
        description="Manage delivery addresses for faster checkout."
      />
      <AddressManager initialAddresses={initialAddresses} />
    </AccountPageShell>
  );
}
