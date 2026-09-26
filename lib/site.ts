export const SITE_NAME = "dedoxperfume";
export const SITE_TITLE = "dedoxperfume | Luxury Fragrances UAE";
export const SITE_LOGO = "/dedox-perfume-logo.svg";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.dedoxperfume.com";
export const SITE_DESCRIPTION =
  "Shop original luxury perfumes at dedoxperfume.com. Men's, women's, and unisex fragrances with fast UAE delivery.";
export const INSTAGRAM_HANDLE = "dedox.perfume";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
export const CONTACT_EMAIL = "dedoxperfume@gmail.com";
export const WHATSAPP_NUMBER = "971555510645";
export const WHATSAPP_DISPLAY = "+971 5555 10645";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_WHOLESALE_MESSAGE =
  "Hi Dedox, I'm interested in wholesale pricing.";
export const WHATSAPP_WHOLESALE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_WHOLESALE_MESSAGE
)}`;
