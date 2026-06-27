/** GROQ queries for dynamic catalog attributes and products. */

export const CATALOG_ATTRIBUTE_PROJECTION = `{
  "id": _id,
  name,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  description,
  isFeatured,
  sortOrder,
  isActive
}`;

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
  "notes": notes[]->${CATALOG_ATTRIBUTE_PROJECTION},
  "accords": accords[]->${CATALOG_ATTRIBUTE_PROJECTION},
  "occasions": occasions[]->${CATALOG_ATTRIBUTE_PROJECTION},
  "concentration": concentration->${CATALOG_ATTRIBUTE_PROJECTION},
  volumeMl,
  isGiftSet,
  images,
  "imageUrl": images[0].asset->url,
  "imageUrls": coalesce(images[].asset->url, [])
}`;

export const PRODUCTS_QUERY = `*[_type == "product"] | order(isFeatured desc, _createdAt desc) ${PRODUCT_PROJECTION}`;

export const PRODUCT_BY_ID_QUERY = `*[_type == "product" && _id == $id][0] ${PRODUCT_PROJECTION}`;

export const PRODUCTS_FILTERED_QUERY = `*[_type == "product"
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && ($brandSlug == "" || brand->slug.current == $brandSlug)
  && ($noteSlug == "" || $noteSlug in notes[]->slug.current)
  && ($accordSlug == "" || $accordSlug in accords[]->slug.current)
  && ($occasionSlug == "" || $occasionSlug in occasions[]->slug.current)
  && ($concentrationSlug == "" || concentration->slug.current == $concentrationSlug)
  && ($inStockOnly == false || inStock == true)
  && ($minPrice == null || price >= $minPrice)
  && ($maxPrice == null || price <= $maxPrice)
  && (
    $search == "" ||
    name match $searchPattern ||
    coalesce(brand->name, brand) match $searchPattern ||
    coalesce(category->name, category) match $searchPattern ||
    count((tags)[@ match $searchPattern]) > 0 ||
    count((notes[]->name)[@ match $searchPattern]) > 0 ||
    count((accords[]->name)[@ match $searchPattern]) > 0 ||
    count((occasions[]->name)[@ match $searchPattern]) > 0 ||
    coalesce(concentration->name, "") match $searchPattern
  )
] | order(isFeatured desc, _createdAt desc) ${PRODUCT_PROJECTION}`;

export const CATALOG_ATTRIBUTES_QUERY = `
  {
    "categories": *[_type == "category" && isActive != false] | order(sortOrder asc, name asc) {
      "id": _id,
      name,
      "slug": slug.current,
      "imageUrl": image.asset->url,
      isFeatured,
      isLuxury,
      sortOrder
    },
    "brands": *[_type == "brand" && isActive != false] | order(sortOrder asc, name asc) {
      "id": _id,
      name,
      "slug": slug.current,
      "imageUrl": logo.asset->url,
      isFeatured,
      sortOrder
    },
    "notes": *[_type == "note" && isActive != false] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION},
    "accords": *[_type == "accord" && isActive != false] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION},
    "occasions": *[_type == "occasion" && isActive != false] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION},
    "concentrations": *[_type == "concentration" && isActive != false] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION}
  }
`;

export const FEATURED_ATTRIBUTES_QUERY = `
  {
    "notes": *[_type == "note" && isActive != false && isFeatured == true] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION},
    "accords": *[_type == "accord" && isActive != false && isFeatured == true] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION},
    "occasions": *[_type == "occasion" && isActive != false && isFeatured == true] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION},
    "concentrations": *[_type == "concentration" && isActive != false] | order(sortOrder asc, name asc) ${CATALOG_ATTRIBUTE_PROJECTION}
  }
`;
