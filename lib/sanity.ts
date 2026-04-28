import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false, // Set to false for write operations and to get fresh data
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});
