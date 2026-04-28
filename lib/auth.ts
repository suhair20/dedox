import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const hashOtp = async (otp: string) => {
  return await bcrypt.hash(otp, SALT_ROUNDS);
};

export const compareOtp = async (otp: string, hashedOtp: string) => {
  return await bcrypt.compare(otp, hashedOtp);
};

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
