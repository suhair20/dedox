"use client";

import { FormEvent, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  SITE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

type Channel = {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
};

const CHANNELS: Channel[] = [
  {
    href: WHATSAPP_URL,
    icon: <MessageCircle className="h-6 w-6" />,
    label: "WhatsApp",
    value: WHATSAPP_DISPLAY,
    hint: "Fastest reply — orders, sizes, and availability.",
  },
  {
    href: INSTAGRAM_URL,
    icon: <InstagramIcon className="h-6 w-6" />,
    label: "Instagram",
    value: `@${INSTAGRAM_HANDLE}`,
    hint: "New arrivals, private edits, and DMs.",
  },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    icon: <Mail className="h-6 w-6" />,
    label: "Email",
    value: CONTACT_EMAIL,
    hint: "We reply within one working day.",
  },
];

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please write a little more in your message.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not send the message. Try again.");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Could not send the message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#140808] text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_22%,#5a0a0a_0%,#1a0808_48%,#0c0505_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[50%] bg-[linear-gradient(245deg,transparent_0%,rgba(122,12,12,0.3)_50%,rgba(252,165,165,0.06)_100%)]" />
        <motion.p
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute -left-2 bottom-2 select-none font-serif-luxury text-[clamp(3.5rem,22vw,14rem)] leading-none tracking-tighter text-[#7a0c0c]/25 sm:left-0 sm:bottom-0"
        >
          HELLO
        </motion.p>

        <div className="relative mx-auto flex min-h-[52vh] w-full max-w-6xl flex-col justify-center px-4 py-14 sm:min-h-[70vh] sm:px-6 sm:py-24 lg:px-8">
          <div className="ml-auto max-w-2xl text-right">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 flex items-center justify-end gap-3 sm:mb-8 sm:gap-4"
            >
              <p className="font-brand text-[10px] font-bold uppercase tracking-[0.3em] text-[#fca5a5] sm:text-[11px] sm:tracking-[0.4em]">
                {SITE_NAME}
              </p>
              <span className="h-px w-8 bg-[#fca5a5] sm:w-10" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className="font-serif-luxury text-[clamp(2rem,9vw,5rem)] leading-[0.95] tracking-tight text-white"
            >
              Let&apos;s talk
              <br />
              <span className="text-[#fca5a5]">fragrance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="ml-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:mt-7 sm:text-lg"
            >
              A question about a bottle, an order, or Rewards — pick the
              channel you like. A real person reads every message.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="mt-6 flex flex-wrap items-center justify-end gap-2 sm:mt-10 sm:gap-3"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7a0c0c] px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_rgba(122,12,12,0.45)] transition hover:bg-[#981212] sm:gap-2 sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.2em]"
              >
                Shop the collection
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/20 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/80 sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.2em] transition hover:border-[#fca5a5] hover:text-[#fca5a5]"
              >
                Back to home
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a0808] px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3 sm:gap-5">
          {CHANNELS.map((channel, index) => {
            const external = channel.href.startsWith("http");
            return (
              <motion.a
                key={channel.label}
                href={channel.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative flex flex-row items-center gap-4 overflow-hidden rounded-[1.5rem] border border-[#7a0c0c]/40 bg-[linear-gradient(160deg,#2a0a0a_0%,#140808_100%)] px-4 py-4 transition hover:-translate-y-1 hover:border-[#fca5a5]/40 hover:bg-[linear-gradient(160deg,#4a0808_0%,#2a0a0a_100%)] hover:shadow-[0_18px_45px_rgba(122,12,12,0.35)] sm:flex-col sm:items-stretch sm:gap-6 sm:rounded-[2rem] sm:px-7 sm:py-10"
              >
                <div className="flex shrink-0 items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7a0c0c] text-white shadow-[0_10px_30px_rgba(122,12,12,0.45)] transition group-hover:bg-[#fca5a5] group-hover:text-[#4a0808] sm:h-14 sm:w-14 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                    {channel.icon}
                  </span>
                  <ArrowUpRight className="hidden h-5 w-5 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#fca5a5] sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#fca5a5] sm:text-[10px] sm:tracking-[0.3em]">
                    {channel.label}
                  </p>
                  <p className="mt-1 truncate font-sans text-[15px] font-medium tracking-[0.02em] text-white tabular-nums sm:mt-2 sm:text-xl">
                    {channel.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50 sm:mt-2 sm:text-sm">
                    {channel.hint}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section className="bg-[#fff5f5] py-10 text-[#1a0808] sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-7 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-8">
          <div className="lg:pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#7a0c0c]/70">
              Write to us
            </p>
            <h2 className="mt-3 font-serif-luxury text-2xl leading-tight text-[#7a0c0c] sm:mt-4 sm:text-4xl">
              Prefer a
              <br />
              longer note?
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-700 sm:mt-5 sm:text-base">
              Tell us what you are looking for — a signature scent, a gift, or
              help with an order. We answer by email within one working day.
            </p>
            <div className="mt-5 border-l-2 border-[#7a0c0c] pl-4 sm:mt-8 sm:pl-5">
              <p className="font-serif-luxury text-base italic text-[#4a0808] sm:text-lg">
                &ldquo;Every bottle arrives authentic, sealed, and ready to
                wear.&rdquo;
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#7a0c0c]/60">
                The Dedox promise
              </p>
            </div>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[1.5rem] border border-[#7a0c0c]/10 bg-white p-4 shadow-[0_24px_60px_rgba(122,12,12,0.12)] sm:rounded-[1.75rem] sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4a0808] via-[#7a0c0c] to-[#fca5a5]" />
            {sent ? (
              <div className="py-10 text-center">
                <p className="font-serif-luxury text-2xl text-gray-900">Message sent</p>
                <p className="mx-auto mt-3 max-w-sm text-sm text-gray-500">
                  Thank you. We will write back to the email you shared.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-semibold text-[#7a0c0c]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                {error ? <p className="text-sm text-[#7a0c0c]">{error}</p> : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#7a0c0c] px-6 py-3 text-[11px] font-black sm:py-3.5 sm:text-xs uppercase tracking-[0.22em] text-white shadow-[0_10px_28px_rgba(122,12,12,0.35)] transition hover:bg-[#981212] disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send message"}
                </button>
              </div>
            )}
          </motion.form>
        </div>
      </section>

      <section className="border-t border-[#7a0c0c]/30 bg-[#1a0808] py-10 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
          <div>
            <p className="font-serif-luxury text-xl text-white sm:text-3xl">
              Buying for a boutique or store?
            </p>
            <p className="mt-1.5 text-xs text-white/55 sm:mt-2 sm:text-sm">
              Wholesale and reseller pricing has its own page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 bg-[#7a0c0c] px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#981212] sm:px-6 sm:py-3 sm:text-[10px] sm:tracking-[0.2em]"
            >
              Wholesale enquiries
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="text-[10px] font-black uppercase tracking-[0.22em] text-[#fca5a5] transition hover:text-white"
            >
              Browse collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
