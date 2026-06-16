import type { Product } from "@/lib/data";

export type ProductFilterOptions = {
  query?: string;
  brand?: string;
  category?: string;
  inStockOnly?: boolean;
  outOfStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "featured" | "price-low" | "price-high" | "name";
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(product: Product, query: string) {
  const q = normalize(query);
  if (!q) return true;

  const haystack = [
    product.name,
    product.brand,
    product.category,
    product.description,
    product.subtitle || "",
    product.sku || "",
    ...(product.tags || []),
    ...(product.notes || []),
    ...(product.accords || []),
    ...(product.occasions || []),
    product.concentration || "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function matchesBrand(product: Product, brand: string) {
  const value = normalize(brand);
  if (!value) return true;

  return (
    normalize(product.brand) === value ||
    normalize(product.brandSlug || "") === value ||
    normalize(product.brandSlug || "").replace(/-/g, " ") === value
  );
}

function matchesCategory(product: Product, category: string) {
  const value = normalize(category);
  if (!value) return true;

  return (
    normalize(product.category) === value ||
    normalize(product.categorySlug || "") === value
  );
}

export function filterProducts(
  products: Product[],
  options: ProductFilterOptions
) {
  const filtered = products.filter((product) => {
    const stockMatch =
      (!options.inStockOnly && !options.outOfStockOnly) ||
      (options.inStockOnly && product.inStock) ||
      (options.outOfStockOnly && !product.inStock);

    const priceMatch =
      (options.minPrice == null || product.price >= options.minPrice) &&
      (options.maxPrice == null || product.price <= options.maxPrice);

    return (
      matchesSearch(product, options.query || "") &&
      matchesBrand(product, options.brand || "") &&
      matchesCategory(product, options.category || "") &&
      stockMatch &&
      priceMatch
    );
  });

  return filtered.sort((a, b) => {
    if (options.sortBy === "price-low") return a.price - b.price;
    if (options.sortBy === "price-high") return b.price - a.price;
    if (options.sortBy === "name") return a.name.localeCompare(b.name);
    if (options.sortBy === "featured") {
      return Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name);
    }
    return 0;
  });
}
