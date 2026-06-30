import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7a0c0c",
    icons: [
      {
        src: SITE_LOGO,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
