export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isFeatured: boolean;
  description: string;
  brand: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  subtitle?: string;
  deliveryInfo?: string;
  warrantyInfo?: string;
  thumbnails?: string[];
}

// Updated working perfume bottle images
const IMG = {
  a: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
  b: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
  c: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
  d: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=800",
  e: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&q=80&w=800",
  f: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800",
};

export const products: Product[] = [
  {
    id: "1",
    name: "Oud Royale",
    price: 120,
    oldPrice: 150,
    image: IMG.c,
    category: "Unisex",
    isFeatured: true,
    description: "A majestic blend of rare agarwood, amber, and warm spices.",
    brand: "Xerjoff",
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    subtitle: "Majestic Oud & Amber Blend",
    deliveryInfo: "Free Express Delivery",
    warrantyInfo: "100% Authentic Product",
    thumbnails: [IMG.c, IMG.a, IMG.b, IMG.d]
  },
  {
    id: "2",
    name: "Midnight Rose",
    price: 95,
    oldPrice: 120,
    image: IMG.b,
    category: "Women",
    isFeatured: true,
    description: "An enchanting nocturnal floral fragrance of velvet roses.",
    brand: "Amouage",
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    subtitle: "Enchanting Velvet Roses",
    deliveryInfo: "Delivery by tomorrow",
    warrantyInfo: "Original Batch Guarantee",
    thumbnails: [IMG.b, IMG.f, IMG.a, IMG.e]
  },
  {
    id: "3",
    name: "Aqua Marine",
    price: 85,
    image: IMG.e,
    category: "Men",
    isFeatured: true,
    description: "The ultimate expression of ocean-fresh freshness.",
    brand: "Amouage",
    inStock: true,
    rating: 4.9,
    reviewCount: 205,
    subtitle: "Deep Ocean Freshness",
    deliveryInfo: "Ships in 24 Hours",
    warrantyInfo: "Premium Quality Seal",
    thumbnails: [IMG.e, IMG.c, IMG.f, IMG.d]
  },
  {
    id: "5",
    name: "Velvet Santal",
    price: 110,
    image: IMG.d,
    category: "Unisex",
    isFeatured: false,
    description: "A smooth, creamy blend of Australian sandalwood.",
    brand: "Akro",
    inStock: true,
    rating: 4.6,
    reviewCount: 56,
    subtitle: "Creamy Australian Sandalwood",
    deliveryInfo: "Standard Shipping",
    warrantyInfo: "Certified Original",
    thumbnails: [IMG.d, IMG.b, IMG.a, IMG.f]
  },
  {
    id: "6",
    name: "Azure Breeze",
    price: 75,
    oldPrice: 95,
    image: IMG.f,
    category: "Men",
    isFeatured: false,
    description: "The refreshing spirit of the Mediterranean.",
    brand: "Alghabra",
    inStock: true,
    rating: 4.5,
    reviewCount: 42,
    subtitle: "Mediterranean Spirit",
    deliveryInfo: "Best value shipping",
    warrantyInfo: "Authorized Dealer",
    thumbnails: [IMG.f, IMG.e, IMG.b, IMG.a]
  },
  {
    id: "7",
    name: "Silk Peony",
    price: 105,
    image: IMG.a,
    category: "Women",
    isFeatured: false,
    description: "A delicate dance of soft petals with blooming peonies.",
    brand: "Affinessence",
    inStock: true,
    rating: 4.8,
    reviewCount: 112,
    subtitle: "Delicate Peony Dance",
    deliveryInfo: "Fragile Secure Packing",
    warrantyInfo: "Batch Tested Authentic",
    thumbnails: [IMG.a, IMG.f, IMG.e, IMG.b]
  },
  {
    id: "9",
    name: "Mystic Musk",
    price: 90,
    image: IMG.b,
    category: "Unisex",
    isFeatured: true,
    description: "An ethereal, skin-like scent of white musk.",
    brand: "Amouage",
    inStock: true,
    rating: 4.7,
    reviewCount: 78,
    subtitle: "Ethereal White Musk",
    deliveryInfo: "Same day dispatch",
    warrantyInfo: "Brand Warranty",
    thumbnails: [IMG.b, IMG.c, IMG.d, IMG.e]
  },
  {
    id: "10",
    name: "Midnight Jasmine",
    price: 115,
    oldPrice: 145,
    image: IMG.a,
    category: "Women",
    isFeatured: true,
    description: "The intoxicating allure of night-blooming jasmine.",
    brand: "24",
    inStock: true,
    rating: 4.9,
    reviewCount: 167,
    subtitle: "Nocturnal Jasmine Allure",
    deliveryInfo: "Priority Shipping",
    warrantyInfo: "Exclusive Batch",
    thumbnails: [IMG.a, IMG.b, IMG.f, IMG.d]
  },
  {
    id: "11",
    name: "Saffron Spices",
    price: 135,
    image: IMG.c,
    category: "Unisex",
    isFeatured: true,
    description: "A warm, radiant blend of Persian saffron and leather.",
    brand: "Xerjoff",
    inStock: true,
    rating: 5.0,
    reviewCount: 92,
    subtitle: "Persian Saffron & Leather",
    deliveryInfo: "Global Express",
    warrantyInfo: "Royal Heritage Seal",
    thumbnails: [IMG.c, IMG.a, IMG.f, IMG.e]
  },
  {
    id: "12",
    name: "Blue Vertigo",
    price: 88,
    image: IMG.e,
    category: "Men",
    isFeatured: true,
    description: "A dizzying rush of alpine air, mint and oakmoss.",
    brand: "Amouage",
    inStock: true,
    rating: 4.6,
    reviewCount: 134,
    subtitle: "Alpine Fresh Rush",
    deliveryInfo: "Standard Delivery",
    warrantyInfo: "Authentic Original",
    thumbnails: [IMG.e, IMG.c, IMG.b, IMG.d]
  },
  {
    id: "13",
    name: "Rose Quartz",
    price: 102,
    oldPrice: 130,
    image: IMG.f,
    category: "Women",
    isFeatured: true,
    description: "A sparkling blend of Turkish rose, lychee and white cedar.",
    brand: "Agatho",
    inStock: true,
    rating: 4.8,
    reviewCount: 156,
    subtitle: "Sparkling Rose & Cedar",
    deliveryInfo: "Safe Box Delivery",
    warrantyInfo: "Geniune Fragrance",
    thumbnails: [IMG.f, IMG.a, IMG.b, IMG.e]
  },
  {
    id: "15",
    name: "Citrus Grove",
    price: 72,
    image: IMG.d,
    category: "Men",
    isFeatured: true,
    description: "A sun-drenched walk through an Italian citrus grove.",
    brand: "Alghabra",
    inStock: true,
    rating: 4.4,
    reviewCount: 68,
    subtitle: "Italian Citrus Harvest",
    deliveryInfo: "Fast Track",
    warrantyInfo: "Verified Batch",
    thumbnails: [IMG.d, IMG.e, IMG.c, IMG.f]
  },
];