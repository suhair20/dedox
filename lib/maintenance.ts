export const MAINTENANCE_BYPASS_COOKIE = "maintenance_bypass";

export function isMaintenanceModeEnabled() {
  return process.env.MAINTENANCE_MODE === "true";
}

export function getMaintenanceBypassSecret() {
  return process.env.MAINTENANCE_BYPASS_SECRET?.trim() || "";
}
