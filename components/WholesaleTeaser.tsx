"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_WHOLESALE_URL } from "@/lib/site";

export default function WholesaleTeaser() {
  return (
    <section className="relative isolate overflow-hidden bg-[#1a0808]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(122,12,12,0.55)_0%,transparent_55%)]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-[#7a0c0c]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-[clamp(1.15rem,5.2vw,2rem)] py-14 sm:flex-row sm:items-center sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#fca5a5]">
            Trade partners
          </p>
          <h2 className="font-serif-luxury text-[clamp(1.7rem,4.5vw,2.6rem)] leading-tight text-white">
            For wholesale enquiries, contact us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
            Boutiques, resellers and distributors — request partner pricing
            direct. Fast and clear.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3"
        >
          <a
            href={WHATSAPP_WHOLESALE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#7a0c0c] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#981212]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
          <Link
            href="/wholesale"
            className="border border-[#fca5a5]/40 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#fca5a5] hover:text-[#fca5a5]"
          >
            Learn more
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
