"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Mail, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
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

function ContactTile({
  href,
  icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-[1.5rem] border border-[#7a0c0c]/10 bg-[#fffaf8] p-5 transition hover:border-[#7a0c0c]/30 hover:bg-white hover:shadow-[0_14px_40px_rgba(122,12,12,0.08)]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7a0c0c] text-white shadow-sm">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-base font-semibold text-gray-900 group-hover:text-[#7a0c0c]">
          {value}
        </span>
        <span className="mt-0.5 block text-xs text-gray-500">{hint}</span>
      </span>
    </a>
  );
}

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
    <div className="bg-white">
      <section className="home-section overflow-hidden">
        <div className="home-section-inner">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#7a0c0c]/70">
              The House
            </p>
            <h1 className="mt-3 font-serif-luxury text-4xl leading-tight text-gray-900 sm:text-5xl">
              Contact
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              Follow us, message us, or write to us — a question about a
              bottle, an order, or Rewards. We read every message.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="rounded-[1.5rem] border border-[#7a0c0c]/10 bg-gradient-to-br from-[#4a0808] via-[#7a0c0c] to-[#4a0808] p-6 text-white">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#fca5a5]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#fca5a5]">
                    About Dedox
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-white/85">
                  Dedox is a house of original luxury fragrance. We curate
                  bottles for presence and longevity — every order arrives
                  authentic, sealed, and ready to wear.
                </p>
              </div>

              <ContactTile
                href={INSTAGRAM_URL}
                icon={<InstagramIcon className="h-5 w-5" />}
                label="Instagram"
                value={`@${INSTAGRAM_HANDLE}`}
                hint="New arrivals and private edits"
              />
              <ContactTile
                href={WHATSAPP_URL}
                icon={<MessageCircle className="h-5 w-5" />}
                label="WhatsApp"
                value={WHATSAPP_DISPLAY}
                hint="Fastest way to reach us"
              />
              <ContactTile
                href={`mailto:${CONTACT_EMAIL}`}
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={CONTACT_EMAIL}
                hint="We reply within one working day"
              />
            </motion.aside>

            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8"
            >
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
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  {error ? <p className="text-sm text-[#7a0c0c]">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary form-btn w-full disabled:opacity-60"
                  >
                    {loading ? "Sending…" : "Send message"}
                  </button>
                </div>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
