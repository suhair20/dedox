import nodemailer from "nodemailer";

type ReviewItem = {
  productId?: string;
  name?: string;
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-dedox-internal");
  if (!secret || secret !== process.env.JWT_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const to = String(body.to || "").trim();
  const orderNumber = String(body.orderNumber || "");
  const items: ReviewItem[] = Array.isArray(body.items) ? body.items : [];

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!gmailUser || !gmailPassword || !to) {
    return Response.json({ sent: false });
  }

  const unique = items.filter(
    (item, index, list) =>
      item.productId && list.findIndex((row) => row.productId === item.productId) === index
  );
  if (unique.length === 0) {
    return Response.json({ sent: false });
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.dedoxperfume.com";
  const links = unique
    .map(
      (item) =>
        `<p style="margin:0 0 10px;"><a href="${site}/product/${item.productId}#reviews" style="color:#7a0c0c;font-weight:700;">Rate ${item.name || "your fragrance"}</a></p>`
    )
    .join("");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPassword },
  });

  await transporter.sendMail({
    from: `"dedoxperfume" <${gmailUser}>`,
    to,
    subject: `How was order ${orderNumber}?`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
        <p style="letter-spacing:0.2em;text-transform:uppercase;color:#6b7280;font-size:11px;font-weight:700;">dedoxperfume</p>
        <h1 style="color:#111827;font-size:24px;">How was your fragrance?</h1>
        <p style="color:#4b5563;line-height:1.7;">Your order ${orderNumber} was delivered. A short review helps other clients choose.</p>
        ${links}
      </div>
    `,
  });

  return Response.json({ sent: true });
}
