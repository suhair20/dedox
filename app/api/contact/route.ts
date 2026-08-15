import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 10) {
      return NextResponse.json({ error: "Please complete the form." }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();

    if (!gmailUser || !gmailPassword) {
      return NextResponse.json(
        { error: "Contact email is not configured yet." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPassword },
    });

    await transporter.sendMail({
      from: `"Dedox Perfume" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `Contact form — ${name}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <p style="letter-spacing: 0.2em; text-transform: uppercase; color: #7a0c0c; font-size: 11px; font-weight: 700;">
            Dedox contact
          </p>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
          <p style="white-space: pre-wrap; line-height: 1.7;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("CONTACT_FORM_ERROR:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
