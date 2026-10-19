import type { Product } from "@/lib/data";

export type ProductFilterOptions = {
  query?: string;
  brand?: string;
  category?: string;
  note?: string;
  accord?: string;
  occasion?: string;
  concentration?: string;
  inStockOnly?: boolean;
  outOfStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "featured" | "price-low" | "price-high" | "name";
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function tokensFrom(...values: Array<string | undefined | null>) {
  return values
    .flatMap((value) => (value || "").toLowerCase().split(/[^a-z0-9]+/))
    .filter((token) => token.length > 0);
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 0; i < a.length; i += 1) {
    let prev = i;
    row[0] = i + 1;
    for (let j = 0; j < b.length; j += 1) {
      const next = row[j + 1];
      const cost = a[i] === b[j] ? 0 : 1;
      row[j + 1] = Math.min(row[j] + 1, next + 1, prev + cost);
      prev = next;
    }
  }
  return row[b.length];
}

function allowedTypoDistance(word: string) {
  if (word.length <= 2) return 0;
  if (word.length <= 5) return 1;
  return 2;
}

function wordMatches(target: string, query: string) {
  if (!query || !target) return false;
  if (target.startsWith(query) || target.includes(query)) return true;
  if (query.length >= 3 && query.includes(target) && target.length >= 3) return true;
  return levenshtein(target, query) <= allowedTypoDistance(query);
}

function searchableValues(product: Product) {
  return [
    product.name,
    product.brand,
    product.category,
    product.description,
    product.subtitle || "",
    product.sku || "",
    product.slug || "",
    ...(product.tags || []),
    ...(product.notes || []).map((item) => item.name),
    ...(product.accords || []).map((item) => item.name),
    ...(product.occasions || []).map((item) => item.name),
    product.concentration?.name || "",
    ...(product.sizes || []).map((size) => size.label),
  ];
}

function searchScore(product: Product, query: string) {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(product.name);
  const brand = normalize(product.brand);
  const nameWords = tokensFrom(product.name);
  const brandWords = tokensFrom(product.brand);
  const first = q.split(/\s+/)[0] || q;

  if (name.startsWith(q) || name.startsWith(first)) return 120;
  if (brand.startsWith(q) || brand.startsWith(first)) return 110;
  if (nameWords.some((word) => word.startsWith(first))) return 100;
  if (brandWords.some((word) => word.startsWith(first))) return 90;
  if (name.includes(q) || name.includes(first)) return 80;
  if (brand.includes(q) || brand.includes(first)) return 70;
  if (nameWords.some((word) => wordMatches(word, first))) return 55;
  if (brandWords.some((word) => wordMatches(word, first))) return 50;
  return 20;
}

function slugMatches(productSlug: string | undefined, filterSlug: string) {
  if (!filterSlug) return true;
  const value = normalize(filterSlug);
  return normalize(productSlug || "") === value;
}

function arrayHasSlug(
  items: Array<{ slug?: string }> | undefined,
  filterSlug: string
) {
  if (!filterSlug) return true;
  const value = normalize(filterSlug);
  return (items || []).some((item) => normalize(item.slug || "") === value);
}

function matchesSearch(product: Product, query: string) {
  const q = normalize(query);
  if (!q) return true;

  const values = searchableValues(product);
  const haystack = values.join(" ").toLowerCase();
  const fieldTokens = tokensFrom(...values);
  const words = q.split(/\s+/).filter(Boolean);

  return words.every((word) => {
    if (haystack.includes(word)) return true;
    return fieldTokens.some((token) => wordMatches(token, word));
  });
}

function matchesBrand(product: Product, brand: string) {
  const value = normalize(brand);
  if (!value) return true;

  return (
    normalize(product.brand) === value ||
    slugMatches(product.brandSlug, brand) ||
    normalize(product.brandSlug || "").replace(/-/g, " ") === value
  );
}

function matchesCategory(product: Product, category: string) {
  const value = normalize(category);
  if (!value) return true;

  return (
    normalize(product.category) === value ||
    slugMatches(product.categorySlug, category)
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
      arrayHasSlug(product.notes, options.note || "") &&
      arrayHasSlug(product.accords, options.accord || "") &&
      arrayHasSlug(product.occasions, options.occasion || "") &&
      slugMatches(product.concentration?.slug, options.concentration || "") &&
      stockMatch &&
      priceMatch
    );
  });

  return filtered.sort((a, b) => {
    if (options.query?.trim()) {
      const scoreDiff = searchScore(b, options.query) - searchScore(a, options.query);
      if (scoreDiff !== 0) return scoreDiff;
    }
    if (options.sortBy === "price-low") return a.price - b.price;
    if (options.sortBy === "price-high") return b.price - a.price;
    if (options.sortBy === "name") return a.name.localeCompare(b.name);
    if (options.sortBy === "featured") {
      return Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });
}
