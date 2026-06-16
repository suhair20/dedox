import { createClient } from "@sanity/client";

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
  });
}
