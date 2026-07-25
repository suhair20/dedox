import dns from "node:dns";
import { createClient } from "@sanity/client";

// Prefer IPv4 — Windows/NAT64 IPv6 routes often cause ConnectTimeoutError to Sanity.
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Older Node versions may not support this; ignore.
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nalaisnd";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-01-01";
const writeToken = process.env.SANITY_API_TOKEN?.trim();
const hasConfiguredWriteToken =
  Boolean(writeToken) && writeToken !== "your_sanity_write_token";

/** Shared read client for storefront content and auth lookups. */
export const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  timeout: 20_000,
});

export function getSanityWriteClient() {
  if (!hasConfiguredWriteToken) {
    throw new Error(
      "Sanity write token is missing. Set SANITY_API_TOKEN in Dedox-perfume environment."
    );
  }

  return createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion,
    token: writeToken,
    timeout: 20_000,
  });
}
