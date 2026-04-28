import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { compareOtp, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // 1. Fetch user from Sanity
    const query = `*[_type == "user" && email == $email][0]`;
    const user = await client.fetch(query, { email });

    if (!user || !user.hashedOtp) {
      return NextResponse.json({ error: "No active OTP found for this email" }, { status: 400 });
    }

    // 2. Security Check: Incorrect Attempts limit (max 5)
    if (user.incorrectAttempts >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 403 }
      );
    }

    // 3. Expiry Check
    const now = new Date();
    const expiry = new Date(user.otpExpiry);
    if (now > expiry) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // 4. Verify OTP
    const isValid = await compareOtp(otp, user.hashedOtp);

    if (!isValid) {
      // Increment incorrect attempts
      await client
        .patch(user._id)
        .inc({ incorrectAttempts: 1 })
        .commit();

      return NextResponse.json(
        { error: `Invalid OTP. ${4 - user.incorrectAttempts} attempts remaining.` },
        { status: 400 }
      );
    }

    // 5. Success: Generate JWT and Set Cookie
    const token = generateToken({ id: user._id, email: user.email });

    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // 6. Security: Clear OTP and reset attempts, Mark as verified
    await client
      .patch(user._id)
      .set({
        hashedOtp: null,
        otpExpiry: null,
        incorrectAttempts: 0,
        isVerified: true,
      })
      .commit();

    return NextResponse.json({ message: "Authenticated successfully" });
  } catch (error: any) {
    console.error("VERIFY_OTP_ERROR:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
