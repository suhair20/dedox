/** Shared catalog attribute shapes for storefront and API responses. */

export type CatalogAttribute = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  isFeatured?: boolean;
  sortOrder?: number;
};

export type CatalogBrand = CatalogAttribute & {
  isFeatured?: boolean;
};

export type CatalogCategory = CatalogAttribute & {
  isLuxury?: boolean;
};

export type CatalogSnapshot = {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  notes: CatalogAttribute[];
  accords: CatalogAttribute[];
  occasions: CatalogAttribute[];
  concentrations: CatalogAttribute[];
};

export type FeaturedAttributesSnapshot = {
  notes: CatalogAttribute[];
  accords: CatalogAttribute[];
  occasions: CatalogAttribute[];
  concentrations: CatalogAttribute[];
};

export function normalizeAttribute(
  item: Partial<CatalogAttribute> & { _id?: string } | null | undefined
): CatalogAttribute | undefined {
  if (!item?.name) return undefined;
  const id = item.id || item._id;
  if (!id) return undefined;
  return {
    id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"),
    imageUrl: item.imageUrl,
    description: item.description,
    isFeatured: item.isFeatured,
    sortOrder: item.sortOrder,
  };
}

export function normalizeAttributes(
  items: Array<Partial<CatalogAttribute> & { _id?: string }> | null | undefined
): CatalogAttribute[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => normalizeAttribute(item))
    .filter((item): item is CatalogAttribute => Boolean(item));
}
