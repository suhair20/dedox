"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  SITE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_WHOLESALE_URL,
} from "@/lib/site";

const STEPS = [
  {
    step: "01",
    title: "Message us",
    body: "Tell us you are looking for wholesale supply on WhatsApp.",
  },
  {
    step: "02",
    title: "Share your needs",
    body: "Share volume, brands, and where you sell — boutique, salon, or gift retail.",
  },
  {
    step: "03",
    title: "Get a quote",
    body: "We reply with partner pricing and next steps for UAE supply.",
  },
];

export default function WholesaleView() {
  return (
    <div className="min-h-screen bg-[#140808] text-white">
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_28%,#4a0808_0%,#1a0808_45%,#0c0505_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[55%] bg-[linear-gradient(115deg,transparent_0%,rgba(122,12,12,0.35)_45%,rgba(252,165,165,0.08)_100%)]" />
        <motion.p
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute -right-4 bottom-8 select-none font-serif-luxury text-[clamp(5rem,22vw,14rem)] leading-none tracking-tighter text-[#7a0c0c]/25 sm:right-0 sm:bottom-0"
        >
          TRADE
        </motion.p>

        <div className="relative mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center gap-4"
            >
              <span className="h-px w-10 bg-[#fca5a5]" />
              <p className="font-brand text-[11px] font-bold uppercase tracking-[0.4em] text-[#fca5a5]">
                {SITE_NAME}
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className="font-serif-luxury text-[clamp(2.6rem,7.5vw,5rem)] leading-[0.92] tracking-tight text-white"
            >
              Partner
              <br />
              <span className="text-[#fca5a5]">wholesale</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="mt-7 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
            >
              Bulk and reseller supply across the UAE. One WhatsApp message —
              we handle partner pricing from there.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <a
                href={WHATSAPP_WHOLESALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#7a0c0c] px-7 py-3.5 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#981212]"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              <a
                href={WHATSAPP_WHOLESALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-wide text-white/55 transition hover:text-[#fca5a5]"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff5f5] py-16 text-[#1a0808] sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] sm:gap-16 sm:px-6 lg:px-8">
          <h2 className="font-serif-luxury text-3xl leading-tight text-[#7a0c0c] sm:text-4xl">
            Built for
            <br />
            trade partners
          </h2>
          <p className="self-end text-base leading-relaxed text-gray-700 sm:text-lg">
            Boutiques, salons, gift retailers, and distributors who want
            authentic Dedox bottles for their clients — with a direct WhatsApp
            conversation to start. No forms. No portal. Just a clear quote.
          </p>
        </div>
      </section>

      <section className="border-t border-[#7a0c0c]/30 bg-[#1a0808] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif-luxury text-3xl text-white sm:text-4xl">
            How it works
          </h2>

          <div className="mt-12 space-y-0">
            {STEPS.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-[#7a0c0c]/25 py-8 sm:grid-cols-[5rem_minmax(0,12rem)_1fr] sm:gap-x-10"
              >
                <span className="font-serif-luxury text-2xl text-[#fca5a5]">
                  {item.step}
                </span>
                <h3 className="text-base font-bold tracking-wide text-white sm:text-lg">
                  {item.title}
                </h3>
                <p className="col-span-2 mt-2 text-sm leading-relaxed text-white/55 sm:col-span-1 sm:mt-0 sm:self-center">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start gap-5 border-t border-[#7a0c0c]/25 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm text-white/55">
              Ready to partner? Message us — we reply with wholesale details.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={WHATSAPP_WHOLESALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
              <Link
                href="/shop"
                className="text-[10px] font-black uppercase tracking-[0.22em] text-[#fca5a5] transition hover:text-white"
              >
                Browse collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
