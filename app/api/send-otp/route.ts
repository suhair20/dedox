import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { hashOtp } from "@/lib/auth";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Generate 6-digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    // 2. Hash OTP
    const hashedOtp = await hashOtp(otp);
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3. Rate Limiting Check (Basic) - Get user if exists
    const query = `*[_type == "user" && email == $email][0]`;
    const user = await client.fetch(query, { email });

    if (user && user.lastOtpSent) {
      const lastSent = new Date(user.lastOtpSent).getTime();
      const now = Date.now();
      if (now - lastSent < 60000) {
        // Less than 1 minute
        return NextResponse.json(
          { error: "Please wait 60 seconds before requesting a new OTP" },
          { status: 429 }
        );
      }
    }

    // 4. Update or Create User in Sanity
    const userData = {
      _type: "user",
      email,
      hashedOtp,
      otpExpiry: expiry.toISOString(),
      lastOtpSent: new Date().toISOString(),
      incorrectAttempts: 0, // Reset attempts on new OTP
      isVerified: user?.isVerified || false,
    };

    if (user) {
      await client
        .patch(user._id)
        .set(userData)
        .commit();
    } else {
      await client.create(userData);
    }

    // 5. Send OTP via Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Dedox Perfume" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Dedox Login OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f3d3e; text-align: center;">Dedox Perfume</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for logging into your account is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f3d3e;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">© 2026 Dedox Perfume. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("SEND_OTP_ERROR:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
