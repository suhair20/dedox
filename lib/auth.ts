import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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

// ✅ Define proper payload type
type TokenPayload = {
  userId: string;
  email: string;
};

// ✅ Generate JWT
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Verify JWT
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null; // ✅ removed unused error
  }
};
