import { client } from "@/lib/sanity";
import type { Product } from "@/lib/data";
import { products as fallbackProducts } from "@/lib/data";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_ID_QUERY,
  PRODUCTS_FILTERED_QUERY,
  CATALOG_ATTRIBUTES_QUERY,
  FEATURED_ATTRIBUTES_QUERY,
} from "@/lib/productQueries";
import type { ProductFilterOptions } from "@/lib/productFilters";
import {
  normalizeAttribute,
  normalizeAttributes,
  type CatalogSnapshot,
  type FeaturedAttributesSnapshot,
} from "@/lib/catalogTypes";

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
  brandId?: string;
  category?: string;
  categorySlug?: string;
  categoryId?: string;
  isFeatured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  deliveryInfo?: string;
  warrantyInfo?: string;
  sku?: string;
  tags?: string[];
  notes?: Array<{ id?: string; _id?: string; name?: string; slug?: string; imageUrl?: string }>;
  accords?: Array<{ id?: string; _id?: string; name?: string; slug?: string; imageUrl?: string }>;
  occasions?: Array<{ id?: string; _id?: string; name?: string; slug?: string; imageUrl?: string }>;
  concentration?: {
    id?: string;
    _id?: string;
    name?: string;
    slug?: string;
    imageUrl?: string;
    description?: string;
  } | null;
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
    categoryId: doc.categoryId,
    isFeatured: doc.isFeatured ?? false,
    description: doc.description || "",
    brand: doc.brand || "Dedox",
    brandSlug: doc.brandSlug,
    brandId: doc.brandId,
    inStock: doc.inStock ?? true,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    subtitle: doc.subtitle,
    deliveryInfo: doc.deliveryInfo,
    warrantyInfo: doc.warrantyInfo,
    thumbnails,
    tags: doc.tags,
    notes: normalizeAttributes(doc.notes),
    accords: normalizeAttributes(doc.accords),
    occasions: normalizeAttributes(doc.occasions),
    concentration: normalizeAttribute(doc.concentration || undefined),
    volumeMl: doc.volumeMl,
    isGiftSet: doc.isGiftSet,
    sku: doc.sku,
  };
}

function hasServerFilters(filters?: ProductFilterOptions) {
  if (!filters) return false;
  return Boolean(
    filters.query ||
      filters.brand ||
      filters.category ||
      filters.note ||
      filters.accord ||
      filters.occasion ||
      filters.concentration ||
      filters.inStockOnly ||
      filters.minPrice != null ||
      filters.maxPrice != null
  );
}

export async function fetchProductsFromSanity(
  filters?: ProductFilterOptions
): Promise<Product[]> {
  if (hasServerFilters(filters)) {
    const docs = await client.fetch<SanityProduct[]>(PRODUCTS_FILTERED_QUERY, {
      search: filters?.query || "",
      searchPattern: filters?.query ? `*${filters.query}*` : "",
      brandSlug: filters?.brand || "",
      categorySlug: filters?.category || "",
      noteSlug: filters?.note || "",
      accordSlug: filters?.accord || "",
      occasionSlug: filters?.occasion || "",
      concentrationSlug: filters?.concentration || "",
      inStockOnly: Boolean(filters?.inStockOnly),
      minPrice: filters?.minPrice ?? null,
      maxPrice: filters?.maxPrice ?? null,
    });

    if (!Array.isArray(docs)) return [];
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

export async function fetchCatalogSnapshot(): Promise<CatalogSnapshot> {
  const snapshot = await client.fetch<CatalogSnapshot>(CATALOG_ATTRIBUTES_QUERY);
  return {
    categories: snapshot?.categories || [],
    brands: snapshot?.brands || [],
    notes: normalizeAttributes(snapshot?.notes),
    accords: normalizeAttributes(snapshot?.accords),
    occasions: normalizeAttributes(snapshot?.occasions),
    concentrations: normalizeAttributes(snapshot?.concentrations),
  };
}

export async function fetchFeaturedAttributes(): Promise<FeaturedAttributesSnapshot> {
  const snapshot = await client.fetch<FeaturedAttributesSnapshot>(FEATURED_ATTRIBUTES_QUERY);
  return {
    notes: normalizeAttributes(snapshot?.notes),
    accords: normalizeAttributes(snapshot?.accords),
    occasions: normalizeAttributes(snapshot?.occasions),
    concentrations: normalizeAttributes(snapshot?.concentrations),
  };
}

/** @deprecated Use fetchCatalogSnapshot */
export async function fetchCatalogOptions() {
  const snapshot = await fetchCatalogSnapshot();
  return {
    categories: snapshot.categories,
    brands: snapshot.brands,
    notes: snapshot.notes,
    accords: snapshot.accords,
    occasions: snapshot.occasions,
    concentrations: snapshot.concentrations,
  };
}
