import { client } from "@/lib/sanity";
import type { Product } from "@/lib/data";
import { products as fallbackProducts } from "@/lib/data";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_ID_QUERY,
  PRODUCTS_FILTERED_QUERY,
} from "@/lib/productQueries";
import type { ProductFilterOptions } from "@/lib/productFilters";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";

type SanityProduct = {
  _id: string;
  name: string;
  slug?: string;
  subtitle?: string;
  price: number;
  oldPrice?: number;
  description?: string;
  brand?: string;
  brandSlug?: string;
  category?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  deliveryInfo?: string;
  warrantyInfo?: string;
  sku?: string;
  tags?: string[];
  notes?: string[];
  accords?: string[];
  occasions?: string[];
  concentration?: string;
  volumeMl?: number;
  isGiftSet?: boolean;
  imageUrl?: string;
  imageUrls?: string[];
};

export function mapSanityProduct(doc: SanityProduct): Product {
  const thumbnails =
    Array.isArray(doc.imageUrls) && doc.imageUrls.length > 0
      ? doc.imageUrls.slice(0, 4)
      : [doc.imageUrl || DEFAULT_IMAGE];
  const image = thumbnails[0] || DEFAULT_IMAGE;

  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    oldPrice: doc.oldPrice,
    image,
    category: doc.category || "Unisex",
    categorySlug: doc.categorySlug,
    isFeatured: doc.isFeatured ?? false,
    description: doc.description || "",
    brand: doc.brand || "Dedox",
    brandSlug: doc.brandSlug,
    inStock: doc.inStock ?? true,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    subtitle: doc.subtitle,
    deliveryInfo: doc.deliveryInfo,
    warrantyInfo: doc.warrantyInfo,
    thumbnails,
    tags: doc.tags,
    notes: doc.notes,
    accords: doc.accords,
    occasions: doc.occasions,
    concentration: doc.concentration,
    volumeMl: doc.volumeMl,
    isGiftSet: doc.isGiftSet,
    sku: doc.sku,
  };
}

export async function fetchProductsFromSanity(
  filters?: ProductFilterOptions
): Promise<Product[]> {
  const hasServerFilters =
    filters &&
    (filters.query ||
      filters.brand ||
      filters.category ||
      filters.inStockOnly ||
      filters.minPrice != null ||
      filters.maxPrice != null);

  if (hasServerFilters) {
    const docs = await client.fetch<SanityProduct[]>(PRODUCTS_FILTERED_QUERY, {
      search: filters?.query || "",
      searchPattern: filters?.query ? `*${filters.query}*` : "",
      brandSlug: filters?.brand ? filters.brand.toLowerCase().replace(/\s+/g, "-") : "",
      brandName: filters?.brand || "",
      categorySlug: filters?.category || "",
      inStockOnly: Boolean(filters?.inStockOnly),
      minPrice: filters?.minPrice ?? null,
      maxPrice: filters?.maxPrice ?? null,
    });

    if (!Array.isArray(docs) || docs.length === 0) {
      return [];
    }

    return docs.map(mapSanityProduct);
  }

  const docs = await client.fetch<SanityProduct[]>(PRODUCTS_QUERY);
  if (!Array.isArray(docs) || docs.length === 0) {
    return fallbackProducts;
  }
  return docs.map(mapSanityProduct);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const doc = await client.fetch<SanityProduct | null>(PRODUCT_BY_ID_QUERY, { id });
  if (!doc) {
    return fallbackProducts.find((p) => p.id === id) ?? null;
  }
  return mapSanityProduct(doc);
}

export async function fetchCatalogOptions() {
  const [categories, brands] = await Promise.all([
    client.fetch(`
      *[_type == "category" && isActive != false] | order(sortOrder asc, name asc) {
        _id,
        name,
        "slug": slug.current,
        isLuxury
      }
    `),
    client.fetch(`
      *[_type == "brand" && isActive != false] | order(sortOrder asc, name asc) {
        _id,
        name,
        "slug": slug.current,
        isFeatured
      }
    `),
  ]);

  return { categories, brands };
}
