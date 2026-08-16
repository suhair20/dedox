export const MAINTENANCE_BYPASS_COOKIE = "maintenance_bypass";

export function isMaintenanceModeEnabled() {
  return process.env.MAINTENANCE_MODE === "true";
}

export function getMaintenanceBypassSecret() {
  return process.env.MAINTENANCE_BYPASS_SECRET?.trim() || "";
}

/** Search crawlers always see the live shop — never the Coming Soon page. */
export function isSearchCrawler(userAgent: string | null) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return (
    ua.includes("googlebot") ||
    ua.includes("google-inspectiontool") ||
    ua.includes("googleother") ||
    ua.includes("storebot-google") ||
    ua.includes("bingbot") ||
    ua.includes("slurp") ||
    ua.includes("duckduckbot") ||
    ua.includes("baiduspider") ||
    ua.includes("yandexbot") ||
    ua.includes("applebot") ||
    ua.includes("facebookexternalhit") ||
    ua.includes("twitterbot")
  );
}
