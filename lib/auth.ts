import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export type AuthChannel = "email" | "phone";

export type TokenPayload = {
  userId: string;
  channel: AuthChannel;
  email?: string;
  phone?: string;
};

export type AuthIdentifier = {
  channel: AuthChannel;
  value: string;
  email?: string;
  phone?: string;
};

export type AuthUserRecord = {
  _id: string;
  email?: string;
  phone?: string;
  hashedOtp?: string | null;
  otpExpiry?: string | null;
  lastOtpSent?: string;
  incorrectAttempts?: number;
  isVerified?: boolean;
};

export type SessionUser = {
  id: string;
  contact: string;
  channel: AuthChannel;
  email?: string;
  phone?: string;
  isVerified: boolean;
};

// ✅ Hash OTP
export const hashOtp = async (otp: string): Promise<string> => {
  return await bcrypt.hash(otp, SALT_ROUNDS);
};

// ✅ Compare OTP
export const compareOtp = async (
  otp: string,
  hashedOtp: string
): Promise<boolean> => {
  return await bcrypt.compare(otp, hashedOtp);
};

// ✅ Generate JWT
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Verify JWT
export const verifyToken = (token: string): (TokenPayload & JwtPayload) | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload & JwtPayload;
  } catch {
    return null; // ✅ removed unused error
  }
};

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: AUTH_SESSION_MAX_AGE,
  path: "/",
});

export const getOtpExpiryDate = () => new Date(Date.now() + 5 * 60 * 1000);

export const getUserLookupField = (channel: AuthChannel) =>
  channel === "email" ? "email" : "phone";

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const normalizePhone = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const withInternationalPrefix = trimmed.startsWith("00")
    ? `+${trimmed.slice(2)}`
    : trimmed;
  const hasPlus = withInternationalPrefix.startsWith("+");
  const digitsOnly = withInternationalPrefix.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return "";
  }

  return hasPlus ? `+${digitsOnly}` : digitsOnly;
};

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPhone = (value: string) =>
  /^\+?[1-9]\d{7,14}$/.test(value);

export const parseAuthIdentifier = (
  rawValue: string | undefined
): AuthIdentifier | null => {
  const value = rawValue?.trim() || "";
  if (!value) {
    return null;
  }

  const normalizedEmail = normalizeEmail(value);
  if (isValidEmail(normalizedEmail)) {
    return {
      channel: "email",
      value: normalizedEmail,
      email: normalizedEmail,
    };
  }

  const normalizedPhone = normalizePhone(value);
  if (isValidPhone(normalizedPhone)) {
    return {
      channel: "phone",
      value: normalizedPhone,
      phone: normalizedPhone,
    };
  }

  return null;
};

export const formatContactLabel = (identifier: AuthIdentifier) =>
  identifier.channel === "email" ? "email" : "phone";
