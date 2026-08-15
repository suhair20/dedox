"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
              A question about a bottle, an order, or Rewards — write to us.
              We read every message.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="rounded-[1.5rem] border border-[#7a0c0c]/10 bg-[#fffaf8] p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7a0c0c] shadow-sm">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Email
                    </p>
                    <a
                      href="mailto:hello@dedoxperfume.com"
                      className="mt-1 block text-sm font-semibold text-gray-900 hover:text-[#7a0c0c]"
                    >
                      hello@dedoxperfume.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[#7a0c0c]/10 bg-[#fffaf8] p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7a0c0c] shadow-sm">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Based in
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      United Arab Emirates
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      We ship originals from the UAE to your door.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[#7a0c0c]/10 bg-[#fffaf8] p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7a0c0c] shadow-sm">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Replies
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Sunday – Thursday
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      We aim to answer within one working day.
                    </p>
                  </div>
                </div>
              </div>
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
