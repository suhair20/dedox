import type { Metadata, Viewport } from "next";
import { Outfit, Cinzel_Decorative, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import {
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_AE",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: SITE_LOGO, type: "image/svg+xml" }],
    shortcut: SITE_LOGO,
    apple: SITE_LOGO,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${outfit.className} ${outfit.variable} ${montserrat.variable} ${cinzel.variable} ${inter.variable} flex min-h-screen flex-col bg-white antialiased text-gray-900`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
