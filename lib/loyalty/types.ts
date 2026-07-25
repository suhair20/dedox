export type RedemptionEntry = {
  _key: string;
  _type: "pointsRedemption";
  points: number;
  productId: string;
  productName: string;
  orderNumber: string;
  createdAt: string;
};

export type RewardProduct = {
  _id: string;
  name: string;
  pointsCost: number;
  price?: number;
  imageUrl?: string;
  inStock?: boolean;
};

export type PointsHistoryItem = {
  type: "earned" | "redeemed";
  points: number;
  label: string;
  date: string;
  orderNumber?: string;
};

export type PointsSummary = {
  balance: number;
  earnedActive: number;
  redeemedActive: number;
  expiringSoon: number;
  history: PointsHistoryItem[];
};
