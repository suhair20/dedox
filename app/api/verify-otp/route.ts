import { NextResponse } from "next/server";
import {
  finalizeOtpVerification,
  getUserByIdentifier,
  incrementIncorrectAttempts,
} from "@/lib/auth-server";
import {
  compareOtp,
  generateToken,
  getAuthCookieOptions,
  parseAuthIdentifier,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body: {
      identifier?: string;
      email?: string;
      phone?: string;
      otp?: string;
    } = await request.json();
    const rawIdentifier = body.identifier || body.email || body.phone;
    const identifier = parseAuthIdentifier(rawIdentifier);
    const otp = body.otp?.trim();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: "A valid email or phone number and OTP are required." },
        { status: 400 }
      );
    }

    const user = await getUserByIdentifier(identifier);

    if (!user || !user.hashedOtp || !user.otpExpiry) {
      return NextResponse.json(
        { error: "No active OTP found for this account." },
        { status: 400 }
      );
    }

    const incorrectAttempts = user.incorrectAttempts ?? 0;

    if (incorrectAttempts >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 403 }
      );
    }

    const now = new Date();
    const expiry = new Date(user.otpExpiry);

    if (now > expiry) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    const isValid = await compareOtp(otp, user.hashedOtp);

    if (!isValid) {
      await incrementIncorrectAttempts(user._id);
      const remainingAttempts = Math.max(0, 4 - incorrectAttempts);

      return NextResponse.json(
        {
          error:
            remainingAttempts > 0
              ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
              : "Invalid OTP. No attempts remaining, please request a new code.",
        },
        { status: 400 }
      );
    }

    const token = generateToken({
      userId: user._id,
      channel: identifier.channel,
      ...(user.email ? { email: user.email } : {}),
      ...(user.phone ? { phone: user.phone } : {}),
    });
    await finalizeOtpVerification(user);

    const response = NextResponse.json({
      message: "Authenticated successfully",
    });
    response.cookies.set("auth_token", token, getAuthCookieOptions());

    return response;

  } catch (error: unknown) {
    console.error("VERIFY_OTP_ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify OTP",
      },
      { status: 500 }
    );
  }
}