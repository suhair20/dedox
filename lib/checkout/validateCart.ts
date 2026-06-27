import { client } from "@/lib/sanity";
import type { CheckoutItemInput, ValidatedCheckoutItem } from "@/lib/checkout/types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800";

type SanityCartProduct = {
  _id: string;
  name: string;
  price: number;
  inStock?: boolean;
  imageUrl?: string;
  brand?: string;
  category?: string;
};

export async function validateCartItems(
  items: CheckoutItemInput[]
): Promise<ValidatedCheckoutItem[]> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const ids = items.map((item) => item.id);
  const products = await client.fetch<SanityCartProduct[]>(
    `*[_type == "product" && _id in $ids]{
      _id,
      name,
      price,
      inStock,
      imageUrl,
      "brand": brand->name,
      "category": category->name
    }`,
    { ids }
  );

  const productById = new Map(products.map((product) => [product._id, product]));

  return items.map((item) => {
    const product = productById.get(item.id);

    if (!product) {
      throw new Error("A product in your cart is no longer available.");
    }

    if (!item.quantity || item.quantity < 1 || item.quantity > 99) {
      throw new Error("Invalid quantity in cart.");
    }

    if (product.inStock === false) {
      throw new Error(`${product.name} is out of stock.`);
    }

    if (typeof product.price !== "number" || product.price < 0) {
      throw new Error(`Invalid price for ${product.name}.`);
    }

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.imageUrl || DEFAULT_IMAGE,
      brand: product.brand,
      category: product.category,
    };
  });
}
