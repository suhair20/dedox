import "server-only";

import {
  AUTH_COOKIE_NAME,
  type AuthIdentifier,
  type AuthUserRecord,
  type SessionUser,
  getUserLookupField,
  verifyToken,
} from "@/lib/auth";
import { client, getSanityWriteClient } from "@/lib/sanity";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserByIdentifier(
  identifier: AuthIdentifier
): Promise<AuthUserRecord | null> {
  const lookupField = getUserLookupField(identifier.channel);

  return client.fetch<AuthUserRecord | null>(
    `*[_type == "user" && ${lookupField} == $value][0]`,
    { value: identifier.value }
  );
}

export async function getUserById(userId: string): Promise<AuthUserRecord | null> {
  return client.fetch<AuthUserRecord | null>(
    `*[_type == "user" && _id == $userId][0]`,
    { userId }
  );
}

export async function saveOtpForIdentifier(
  identifier: AuthIdentifier,
  otpState: {
    hashedOtp: string;
    otpExpiry: string;
    lastOtpSent: string;
    isVerified?: boolean;
  },
  existingUser?: AuthUserRecord | null
) {
  const writeClient = getSanityWriteClient();
  const user = existingUser ?? (await getUserByIdentifier(identifier));
  const nextDocument = {
    _type: "user",
    ...(identifier.email ? { email: identifier.email } : {}),
    ...(identifier.phone ? { phone: identifier.phone } : {}),
    hashedOtp: otpState.hashedOtp,
    otpExpiry: otpState.otpExpiry,
    lastOtpSent: otpState.lastOtpSent,
    incorrectAttempts: 0,
    isVerified: otpState.isVerified ?? user?.isVerified ?? false,
  };

  if (user?._id) {
    await writeClient.patch(user._id).set(nextDocument).commit();
    return user._id;
  }

  const created = await writeClient.create(nextDocument);
  return created._id;
}

export async function incrementIncorrectAttempts(userId: string) {
  const writeClient = getSanityWriteClient();
  await writeClient.patch(userId).inc({ incorrectAttempts: 1 }).commit();
}

export async function finalizeOtpVerification(user: AuthUserRecord) {
  const writeClient = getSanityWriteClient();
  await writeClient
    .patch(user._id)
    .set({
      hashedOtp: null,
      otpExpiry: null,
      incorrectAttempts: 0,
      isVerified: true,
    })
    .commit();
}

export function buildSessionUser(user: AuthUserRecord): SessionUser | null {
  const contact = user.email || user.phone;
  if (!contact) {
    return null;
  }

  return {
    id: user._id,
    email: user.email,
    phone: user.phone,
    contact,
    channel: user.email ? "email" : "phone",
    isVerified: Boolean(user.isVerified),
  };
}

export async function getCurrentSession(): Promise<{ user: SessionUser } | null> {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return null;
  }

  const user = await getUserById(payload.userId);
  if (!user || !user.isVerified) {
    return null;
  }

  const sessionUser = buildSessionUser(user);
  if (!sessionUser) {
    return null;
  }

  return { user: sessionUser };
}

export async function requireAuthSession(redirectPath: string) {
  const session = await getCurrentSession();
  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  }

  return session;
}
