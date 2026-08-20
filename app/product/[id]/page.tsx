import type { Metadata } from "next";
import ProductView from "@/components/product/ProductView";
import { fetchProductById } from "@/lib/products";
import { client } from "@/lib/sanity";
import { mapStoreReview, STORE_REVIEW_PROJECTION } from "@/lib/reviews";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = {
  params: { id: string };
};

function productDescription(name: string, brand: string, description?: string) {
  if (description?.trim()) return description.trim().slice(0, 160);
  return `Buy ${name} by ${brand} at ${SITE_NAME}. Original luxury fragrance with fast UAE delivery.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = await fetchProductById(params.id);
    if (!product) {
      return { title: "Product not found" };
    }

    const title = `${product.name} by ${product.brand}`;
    const description = productDescription(product.name, product.brand, product.description);
    const url = `${SITE_URL}/product/${product.id}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url,
        type: "website",
        images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  let product = null;
  try {
    product = await fetchProductById(params.id);
  } catch {
    product = null;
  }
  const url = `${SITE_URL}/product/${params.id}`;
  let publishedReviews: ReturnType<typeof mapStoreReview>[] = [];
  if (product?.reviewCount) {
    try {
      const docs = await client.fetch(
        `*[_type == "review" && status == "published" && product._ref == $productId] | order(_createdAt desc) [0...8] ${STORE_REVIEW_PROJECTION}`,
        { productId: product.id }
      );
      publishedReviews = Array.isArray(docs) ? docs.map(mapStoreReview) : [];
    } catch {
      publishedReviews = [];
    }
  }

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.image,
        description: product.description || product.subtitle || product.name,
        sku: product.sku || product.id,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        category: product.category,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "AED",
          price: product.price,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        ...(product.reviewCount
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
              review: publishedReviews.map((review) => ({
                "@type": "Review",
                author: { "@type": "Person", name: review.authorName },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: review.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
                reviewBody: review.body,
              })),
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ProductView params={params} />
    </>
  );
}
