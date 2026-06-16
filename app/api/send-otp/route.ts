import { NextResponse } from "next/server";
import { getUserByIdentifier, saveOtpForIdentifier } from "@/lib/auth-server";
import {
  formatContactLabel,
  getOtpExpiryDate,
  hashOtp,
  parseAuthIdentifier,
  type AuthUserRecord,
} from "@/lib/auth";
import { deliverOtpCode } from "@/lib/otp-delivery";
import otpGenerator from "otp-generator";

export async function POST(request: Request) {
  try {
    const body: { identifier?: string; email?: string; phone?: string } =
      await request.json();
    const rawIdentifier = body.identifier || body.email || body.phone;
    const identifier = parseAuthIdentifier(rawIdentifier);

    if (!identifier) {
      return NextResponse.json(
        {
          error:
            "Enter a valid email address or an international phone number with country code.",
        },
        { status: 400 }
      );
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const hashedOtp = await hashOtp(otp);
    const expiry = getOtpExpiryDate();
    const user: AuthUserRecord | null = await getUserByIdentifier(identifier);

    if (user && user.lastOtpSent) {
      const lastSent = new Date(user.lastOtpSent).getTime();
      const now = Date.now();

      if (now - lastSent < 60000) {
        return NextResponse.json(
          { error: "Please wait 60 seconds before requesting a new OTP" },
          { status: 429 }
        );
      }
    }

    await saveOtpForIdentifier(
      identifier,
      {
        hashedOtp,
        otpExpiry: expiry.toISOString(),
        lastOtpSent: new Date().toISOString(),
        isVerified: user?.isVerified,
      },
      user
    );
    await deliverOtpCode(identifier, otp);

    return NextResponse.json({
      message: `OTP sent to your ${formatContactLabel(identifier)} successfully.`,
    });

  } catch (error: unknown) {
    console.error("SEND_OTP_ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}
