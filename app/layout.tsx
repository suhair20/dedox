import type { Metadata } from "next";
import { Outfit, Cinzel_Decorative, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-montserrat",
});
const cinzel = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-playfair",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Dedox Perfume",
    template: "%s | Dedox Perfume",
  },
  description:
    "Shop premium luxury fragrances at Dedox Perfume. Authentic perfumes, fast UAE delivery, and curated collections for every occasion.",
  applicationName: "Dedox Perfume",
  openGraph: {
    title: "Dedox Perfume",
    siteName: "Dedox Perfume",
    description:
      "Shop premium luxury fragrances at Dedox Perfume. Authentic perfumes, fast UAE delivery, and curated collections.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dedox Perfume",
    description:
      "Shop premium luxury fragrances at Dedox Perfume. Authentic perfumes and curated collections.",
  },
  icons: {
    icon: [
      { url: "/dedox-perfume-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/dedox-perfume-logo.svg",
    apple: "/dedox-perfume-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} ${outfit.variable} ${montserrat.variable} ${cinzel.variable} ${inter.variable} flex min-h-screen flex-col bg-white antialiased text-gray-900`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
