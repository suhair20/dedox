import { client } from "@/lib/sanity";
import type { CheckoutItemInput, ValidatedCheckoutItem } from "@/lib/checkout/types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";

type SanityCartSize = {
  _key?: string;
  label?: string;
  price?: number;
  inStock?: boolean;
};

type SanityCartProduct = {
  _id: string;
  name: string;
  price: number;
  inStock?: boolean;
  imageUrl?: string;
  brand?: string;
  category?: string;
  sizes?: SanityCartSize[];
};

export async function validateCartItems(
  items: CheckoutItemInput[]
): Promise<ValidatedCheckoutItem[]> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const productIds = [
    ...new Set(items.map((item) => item.productId || item.id.split("__")[0])),
  ];

  const products = await client.fetch<SanityCartProduct[]>(
    `*[_type == "product" && _id in $ids]{
      _id,
      name,
      price,
      inStock,
      "imageUrl": images[0].asset->url,
      "brand": brand->name,
      "category": category->name,
      sizes[]{ _key, label, price, inStock }
    }`,
    { ids: productIds }
  );

  const productById = new Map(products.map((product) => [product._id, product]));

  return items.map((item) => {
    const productId = item.productId || item.id.split("__")[0];
    const product = productById.get(productId);

    if (!product) {
      throw new Error("A product in your cart is no longer available.");
    }

    if (!item.quantity || item.quantity < 1 || item.quantity > 99) {
      throw new Error("Invalid quantity in cart.");
    }

    const sizes = product.sizes || [];
    const sizeKey = item.sizeKey || (item.id.includes("__") ? item.id.split("__")[1] : undefined);
    const selectedSize = sizeKey
      ? sizes.find((size) => size._key === sizeKey || size.label === item.sizeLabel)
      : undefined;

    if (sizes.length > 0 && sizeKey && !selectedSize) {
      throw new Error(`${product.name}: selected size is no longer available.`);
    }

    if (selectedSize) {
      if (selectedSize.inStock === false) {
        throw new Error(`${product.name} (${selectedSize.label}) is out of stock.`);
      }
      if (typeof selectedSize.price !== "number" || selectedSize.price < 0) {
        throw new Error(`Invalid price for ${product.name} (${selectedSize.label}).`);
      }
    } else {
      if (product.inStock === false) {
        throw new Error(`${product.name} is out of stock.`);
      }
      if (typeof product.price !== "number" || product.price < 0) {
        throw new Error(`Invalid price for ${product.name}.`);
      }
    }

    const sizeLabel = selectedSize?.label || item.sizeLabel;
    const name = sizeLabel ? `${product.name} (${sizeLabel})` : product.name;

    return {
      id: product._id,
      name,
      price: selectedSize ? selectedSize.price! : product.price,
      quantity: item.quantity,
      image: product.imageUrl || DEFAULT_IMAGE,
      brand: product.brand,
      category: product.category,
      sizeKey: selectedSize?._key || sizeKey,
      sizeLabel,
    };
  });
}
