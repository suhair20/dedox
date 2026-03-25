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
}

// Clean white-background perfume bottle images from Unsplash
const IMG = {
  a: "https://images.unsplash.com/photo-1587017539504-67cfcf4f5ef6?auto=format&fit=crop&q=80&w=800",
  b: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
  c: "https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80&w=800",
  d: "https://images.unsplash.com/photo-1523293182086-da6b3da24718?auto=format&fit=crop&q=80&w=800",
  e: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=800",
  f: "https://images.unsplash.com/photo-1582211594533-268f4f1edeb9?auto=format&fit=crop&q=80&w=800",
  g: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
  h: "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?auto=format&fit=crop&q=80&w=800",
  i: "https://images.unsplash.com/photo-1622618991746-d88ce7ced3a4?auto=format&fit=crop&q=80&w=800",
  j: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
};

export const products: Product[] = [
  { id: "1",  name: "Oud Royale",        price: 120, oldPrice: 150, image: IMG.c, category: "Unisex", isFeatured: true,  description: "A majestic blend of rare agarwood, amber, and warm spices.", brand: "Xerjoff",      inStock: true  },
  { id: "2",  name: "Midnight Rose",     price: 95,  oldPrice: 120, image: IMG.b, category: "Women",  isFeatured: true,  description: "An enchanting nocturnal floral fragrance of velvet roses.",  brand: "Amouage",      inStock: true  },
  { id: "3",  name: "Aqua Marine",       price: 85,                 image: IMG.e, category: "Men",    isFeatured: true,  description: "The ultimate expression of ocean-fresh freshness.",         brand: "Amouage",      inStock: true  },
  
  { id: "5",  name: "Velvet Santal",     price: 110,                image: IMG.g, category: "Unisex", isFeatured: false, description: "A smooth, creamy blend of Australian sandalwood.",          brand: "Akro",         inStock: true  },
  { id: "6",  name: "Azure Breeze",      price: 75,  oldPrice: 95,  image: IMG.h, category: "Men",    isFeatured: false, description: "The refreshing spirit of the Mediterranean.",              brand: "Alghabra",     inStock: true  },
  { id: "7",  name: "Silk Peony",        price: 105,                image: IMG.f, category: "Women",  isFeatured: false, description: "A delicate dance of soft petals with blooming peonies.",   brand: "Affinessence",  inStock: true  },
  
  { id: "9",  name: "Mystic Musk",       price: 90,                 image: IMG.j, category: "Unisex", isFeatured: true,  description: "An ethereal, skin-like scent of white musk.",              brand: "Amouage",      inStock: true  },
  { id: "10", name: "Midnight Jasmine",  price: 115, oldPrice: 145, image: IMG.b, category: "Women",  isFeatured: true,  description: "The intoxicating allure of night-blooming jasmine.",       brand: "24",           inStock: true  },
  { id: "11", name: "Saffron Spices",    price: 135,                image: IMG.c, category: "Unisex", isFeatured: true,  description: "A warm, radiant blend of Persian saffron and leather.",    brand: "Xerjoff",      inStock: true  },
  { id: "12", name: "Blue Vertigo",      price: 88,                 image: IMG.e, category: "Men",    isFeatured: true,  description: "A dizzying rush of alpine air, mint and oakmoss.",         brand: "Amouage",      inStock: true  },
  { id: "13", name: "Rose Quartz",       price: 102, oldPrice: 130, image: IMG.g, category: "Women",  isFeatured: true,  description: "A sparkling blend of Turkish rose, lychee and white cedar.",brand: "Agatho",       inStock: true  },
  
  { id: "15", name: "Citrus Grove",      price: 72,                 image: IMG.h, category: "Men",    isFeatured: true,  description: "A sun-drenched walk through an Italian citrus grove.",     brand: "Alghabra",     inStock: true  },
  
];
