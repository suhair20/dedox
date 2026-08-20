export type StoreReview = {
  id: string;
  createdAt: string;
  rating: number;
  title?: string;
  body: string;
  verifiedPurchase: boolean;
  authorName: string;
  productId?: string;
  productName?: string;
  productImage?: string;
};

export const STORE_REVIEW_PROJECTION = `{
  _id,
  _createdAt,
  rating,
  title,
  body,
  verifiedPurchase,
  authorName,
  "productId": product._ref,
  "productName": product->name,
  "productImage": product->images[0].asset->url
}`;

export function mapStoreReview(doc: {
  _id: string;
  _createdAt: string;
  rating: number;
  title?: string;
  body: string;
  verifiedPurchase?: boolean;
  authorName: string;
  productId?: string;
  productName?: string;
  productImage?: string;
}): StoreReview {
  return {
    id: doc._id,
    createdAt: doc._createdAt,
    rating: Number(doc.rating) || 0,
    title: doc.title,
    body: doc.body,
    verifiedPurchase: Boolean(doc.verifiedPurchase),
    authorName: doc.authorName,
    productId: doc.productId,
    productName: doc.productName,
    productImage: doc.productImage,
  };
}

export function ratingBreakdown(reviews: Array<{ rating: number }>) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[star] += 1;
  }
  return counts;
}
