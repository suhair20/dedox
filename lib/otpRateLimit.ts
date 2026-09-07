const IDENTITY_COOLDOWN_MS = 60 * 1000;
const IDENTITY_DAY_MS = 24 * 60 * 60 * 1000;
const IDENTITY_DAY_MAX = 8;
const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_WINDOW_MAX = 5;

const identityHits = new Map<string, number[]>();
const ipHits = new Map<string, number[]>();

function prune(hits: number[], windowMs: number, now: number) {
  return hits.filter((time) => now - time < windowMs);
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return ip.slice(0, 64);
}

export function consumeOtpSendLimit(
  ip: string,
  identityKey: string
): { ok: true } | { ok: false; error: string } {
  const now = Date.now();
  const identityKeySafe = identityKey.toLowerCase().trim();
  const recentIdentity = prune(identityHits.get(identityKeySafe) || [], IDENTITY_DAY_MS, now);
  const recentIp = prune(ipHits.get(ip) || [], IP_WINDOW_MS, now);

  const lastForIdentity = recentIdentity[recentIdentity.length - 1];
  if (lastForIdentity && now - lastForIdentity < IDENTITY_COOLDOWN_MS) {
    return { ok: false, error: "Please wait 60 seconds before requesting a new OTP" };
  }

  if (recentIdentity.length >= IDENTITY_DAY_MAX) {
    return {
      ok: false,
      error: "Too many login codes for this account today. Try again tomorrow.",
    };
  }

  if (recentIp.length >= IP_WINDOW_MAX) {
    return {
      ok: false,
      error: "Too many login codes from this device. Please try again later.",
    };
  }

  recentIdentity.push(now);
  recentIp.push(now);
  identityHits.set(identityKeySafe, recentIdentity);
  ipHits.set(ip, recentIp);
  return { ok: true };
}
