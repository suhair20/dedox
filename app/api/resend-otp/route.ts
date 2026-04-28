import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { hashOtp } from "@/lib/auth";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

// ✅ Define User type (adjust fields if needed)
type User = {
  _id: string;
  email: string;
  lastOtpSent?: string;
};

export async function POST(request: Request) {
  try {
    const body: { email?: string } = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Check user + rate limit
    const query = `*[_type == "user" && email == $email][0]`;
    const user: User | null = await client.fetch(query, { email });

    if (user && user.lastOtpSent) {
      const lastSent = new Date(user.lastOtpSent).getTime();
      const now = Date.now();

      if (now - lastSent < 60000) {
        return NextResponse.json(
          { error: "Please wait 60 seconds before resending" },
          { status: 429 }
        );
      }
    }

    // 2. Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const hashedOtp = await hashOtp(otp);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // 3. Update user
    if (user) {
      await client
        .patch(user._id)
        .set({
          hashedOtp,
          otpExpiry: expiry.toISOString(),
          lastOtpSent: new Date().toISOString(),
          incorrectAttempts: 0,
        })
        .commit();
    } else {
      return NextResponse.json(
        { error: "User process not started" },
        { status: 400 }
      );
    }

    // 4. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Dedox Perfume" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your New Login OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f3d3e; text-align: center;">Dedox Perfume</h2>
          <p>You requested a new OTP. Your new code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f3d3e;">
            ${otp}
          </div>
          <p>Valid for 5 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP resent successfully" });

  } catch (error: unknown) {
    console.error("RESEND_OTP_ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to resend OTP",
      },
      { status: 500 }
    );
  }
}