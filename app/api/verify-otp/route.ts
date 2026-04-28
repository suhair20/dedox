import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { compareOtp, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ✅ Define User type
type User = {
  _id: string;
  email: string;
  hashedOtp?: string;
  otpExpiry?: string;
  incorrectAttempts: number;
};

export async function POST(request: Request) {
  try {
    const body: { email?: string; otp?: string } = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // 1. Fetch user
    const query = `*[_type == "user" && email == $email][0]`;
    const user: User | null = await client.fetch(query, { email });

    if (!user || !user.hashedOtp) {
      return NextResponse.json(
        { error: "No active OTP found for this email" },
        { status: 400 }
      );
    }

    // 2. Attempt limit
    if (user.incorrectAttempts >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 403 }
      );
    }

    // 3. Expiry check
    const now = new Date();
    const expiry = new Date(user.otpExpiry!);

    if (now > expiry) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // 4. Verify OTP
    const isValid = await compareOtp(otp, user.hashedOtp);

    if (!isValid) {
      await client
        .patch(user._id)
        .inc({ incorrectAttempts: 1 })
        .commit();

      return NextResponse.json(
        {
          error: `Invalid OTP. ${
            4 - user.incorrectAttempts
          } attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // 5. Generate JWT
    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // 6. Clear OTP + reset attempts
    await client
      .patch(user._id)
      .set({
        hashedOtp: null,
        otpExpiry: null,
        incorrectAttempts: 0,
        isVerified: true,
      })
      .commit();

    return NextResponse.json({
      message: "Authenticated successfully",
    });

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