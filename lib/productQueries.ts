/** GROQ queries aligned with Dedox-Admin/src/schemas (legacy string + reference support). */

export const PRODUCT_PROJECTION = `{
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  subtitle,
  price,
  oldPrice,
  description,
  "brand": coalesce(brand->name, brand),
  "brandSlug": brand->slug.current,
  "brandId": brand._ref,
  "category": coalesce(category->name, category),
  "categorySlug": category->slug.current,
  "categoryId": category._ref,
  isFeatured,
  inStock,
  rating,
  reviewCount,
  deliveryInfo,
  warrantyInfo,
  sku,
  tags,
  notes,
  accords,
  occasions,
  concentration,
  volumeMl,
  isGiftSet,
  images,
  "imageUrl": images[0].asset->url,
  "imageUrls": coalesce(images[].asset->url, [])
}`;

export const PRODUCTS_QUERY = `*[_type == "product"] | order(isFeatured desc, _createdAt desc) ${PRODUCT_PROJECTION}`;

export const PRODUCT_BY_ID_QUERY = `*[_type == "product" && _id == $id][0] ${PRODUCT_PROJECTION}`;

export const PRODUCTS_FILTERED_QUERY = `*[_type == "product"
  && ($categorySlug == "" || category->slug.current == $categorySlug || lower(category) == lower($categorySlug))
  && ($brandSlug == "" || brand->slug.current == $brandSlug || lower(brand) == lower($brandSlug))
  && ($brandName == "" || coalesce(brand->name, brand) == $brandName)
  && ($inStockOnly == false || inStock == true)
  && ($minPrice == null || price >= $minPrice)
  && ($maxPrice == null || price <= $maxPrice)
  && (
    $search == "" ||
    name match $searchPattern ||
    coalesce(brand->name, brand) match $searchPattern ||
    coalesce(category->name, category) match $searchPattern ||
    count((tags)[@ match $searchPattern]) > 0 ||
    count((notes)[@ match $searchPattern]) > 0
  )
] | order(isFeatured desc, _createdAt desc) ${PRODUCT_PROJECTION}`;
