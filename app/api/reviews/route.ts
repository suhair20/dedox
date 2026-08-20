import { NextResponse } from "next/server";
import { client, getSanityWriteClient } from "@/lib/sanity";
import { getCurrentSession } from "@/lib/auth-server";
import { mapStoreReview, STORE_REVIEW_PROJECTION } from "@/lib/reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId") || "";
  const featured = searchParams.get("featured") === "1";
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 24)));

  try {
    const filter = [
      '_type == "review"',
      'status == "published"',
      productId ? "product._ref == $productId" : "",
      featured ? "isFeatured == true" : "",
    ]
      .filter(Boolean)
      .join(" && ");

    const docs = await client.fetch(
      `*[${filter}] | order(_createdAt desc) [0...${limit}] ${STORE_REVIEW_PROJECTION}`,
      { productId }
    );

    return NextResponse.json({
      reviews: Array.isArray(docs) ? docs.map(mapStoreReview) : [],
    });
  } catch (error) {
    console.error("REVIEWS_GET_ERROR:", error);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = String(body.productId || "").trim();
    const authorName = String(body.authorName || "").trim();
    const authorEmail = String(body.authorEmail || "").trim();
    const title = String(body.title || "").trim();
    const comment = String(body.body || body.comment || "").trim();
    const rating = Number(body.rating);

    if (!productId || !authorName || comment.length < 8 || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please add your name, a 1–5 rating, and a review of at least 8 characters." },
        { status: 400 }
      );
    }

    const session = await getCurrentSession();
    const writeClient = getSanityWriteClient();

    let verifiedPurchase = false;
    let orderId: string | undefined;

    if (session?.user?.id) {
      const order = await client.fetch<{ _id: string } | null>(
        `*[_type == "order" && status == "delivered" && user._ref == $userId && $productId in items[].productId][0]{ _id }`,
        { userId: session.user.id, productId }
      );
      if (order?._id) {
        verifiedPurchase = true;
        orderId = order._id;
      }
    }

    const created = await writeClient.create({
      _type: "review",
      product: { _type: "reference", _ref: productId },
      authorName,
      authorEmail: authorEmail || session?.user?.email || undefined,
      user: session?.user?.id
        ? { _type: "reference", _ref: session.user.id }
        : undefined,
      order: orderId ? { _type: "reference", _ref: orderId } : undefined,
      rating: Math.round(rating),
      title: title || undefined,
      body: comment,
      status: "pending",
      verifiedPurchase,
      isFeatured: false,
    });

    return NextResponse.json({
      ok: true,
      id: created._id,
      message: "Thank you. Your review will appear after we approve it.",
    });
  } catch (error) {
    console.error("REVIEWS_POST_ERROR:", error);
    return NextResponse.json({ error: "Could not save your review." }, { status: 500 });
  }
}
