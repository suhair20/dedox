import { requireAuthSession } from "@/lib/auth-server";
import {
  getPointsSummary,
  listRewardProducts,
} from "@/lib/loyalty/service";
import type { PointsSummary, RewardProduct } from "@/lib/loyalty/types";
import AccountPageShell from "@/components/account/AccountPageShell";
import AccountPageHeader from "@/components/account/AccountPageHeader";
import RewardsView from "@/components/account/RewardsView";

const emptySummary: PointsSummary = {
  balance: 0,
  earnedActive: 0,
  redeemedActive: 0,
  expiringSoon: 0,
  history: [],
};

export default async function AccountRewardsPage() {
  const { user } = await requireAuthSession("/account/rewards");

  let summary: PointsSummary = emptySummary;
  let rewards: RewardProduct[] = [];

  try {
    [summary, rewards] = await Promise.all([
      getPointsSummary(user.id),
      listRewardProducts(),
    ]);
  } catch (error) {
    console.error("ACCOUNT_REWARDS_PAGE_ERROR:", error);
  }

  return (
    <AccountPageShell>
      <AccountPageHeader
        backHref="/account"
        backLabel="Account"
        title="Rewards"
        description="Earn points on delivered orders and unlock free premium bottles."
      />
      <RewardsView summary={summary} rewards={rewards} />
    </AccountPageShell>
  );
}
