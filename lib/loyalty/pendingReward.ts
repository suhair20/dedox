const PENDING_REWARD_KEY = "dedox_pending_reward";

export type PendingReward = {
  productId: string;
  name: string;
  pointsCost: number;
};

export function savePendingReward(reward: PendingReward) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_REWARD_KEY, JSON.stringify(reward));
}

export function readPendingReward(): PendingReward | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_REWARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingReward;
    if (!parsed?.productId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingReward() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_REWARD_KEY);
}
