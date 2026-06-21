import { AuthIdentifier } from "@/lib/auth";
import nodemailer from "nodemailer";

function buildOtpMessage(otp: string, resend: boolean) {
  const intro = resend
    ? "You requested a new one-time password. Use the code below to continue."
    : "Use the one-time password below to securely access your Dedox account.";

  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; border: 1px solid #f1f1f1; border-radius: 24px; background: #ffffff;">
      <p style="margin: 0 0 12px; letter-spacing: 0.24em; text-transform: uppercase; color: #6b7280; font-size: 11px; font-weight: 700;">
        Dedox Perfume Authentication
      </p>
      <h1 style="margin: 0 0 16px; color: #111827; font-size: 28px; line-height: 1.2;">
        Your secure login code
      </h1>
      <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.7;">
        ${intro}
      </p>
      <div style="background: #7a0c0c; color: #ffffff; text-align: center; padding: 20px 24px; border-radius: 20px; font-size: 34px; font-weight: 800; letter-spacing: 0.5em;">
        ${otp}
      </div>
      <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px; line-height: 1.7;">
        This code expires in 5 minutes. If you did not request it, you can ignore this email.
      </p>
    </div>
  `;
}

async function sendEmailOtp(email: string, otp: string, resend: boolean) {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!gmailUser || !gmailPassword) {
    throw new Error(
      "Email OTP is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  await transporter.sendMail({
    from: `"Dedox Perfume" <${gmailUser}>`,
    to: email,
    subject: resend ? "Your new Dedox OTP" : "Your Dedox login OTP",
    html: buildOtpMessage(otp, resend),
  });
}

async function sendPhoneOtp(phone: string, otp: string, resend: boolean) {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const twilioToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twilioFrom = process.env.TWILIO_FROM_PHONE?.trim();
  const twilioMessagingServiceSid =
    process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();

  if (!twilioSid || !twilioToken || (!twilioFrom && !twilioMessagingServiceSid)) {
    throw new Error(
      "Phone OTP is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_FROM_PHONE or TWILIO_MESSAGING_SERVICE_SID."
    );
  }

  const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
  const body = new URLSearchParams({
    To: phone,
    Body: `Your Dedox OTP is ${otp}. It expires in 5 minutes.${resend ? " This is your latest code." : ""}`,
  });

  if (twilioMessagingServiceSid) {
    body.set("MessagingServiceSid", twilioMessagingServiceSid);
  } else if (twilioFrom) {
    body.set("From", twilioFrom);
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("TWILIO_SEND_ERROR:", errorText);
    throw new Error("Failed to send OTP to this phone number.");
  }
}

export async function deliverOtpCode(
  identifier: AuthIdentifier,
  otp: string,
  resend = false
) {
  if (identifier.channel === "email") {
    await sendEmailOtp(identifier.value, otp, resend);
    return;
  }

  await sendPhoneOtp(identifier.value, otp, resend);
}
