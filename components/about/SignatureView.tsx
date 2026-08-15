"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const pillars = [
  {
    n: "01",
    title: "Original only",
    text: "Every bottle is authentic, sealed, and sourced for the true juice — never a copy.",
  },
  {
    n: "02",
    title: "Made for this climate",
    text: "We edit for presence and longevity in the Gulf — scents that hold from noon to night.",
  },
  {
    n: "03",
    title: "A house that gives back",
    text: "Dedox Rewards turns every qualifying order into points, and points into a free bottle.",
  },
];

export default function SignatureView() {
  return (
    <div className="bg-white">
      <section className="home-section overflow-hidden">
        <div className="home-section-inner">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#7a0c0c]/70">
              The House
            </p>
            <h1 className="mt-3 font-serif-luxury text-4xl leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              The Signature
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Dedox is a UAE house of original luxury fragrance. We curate
              bottles for character, longevity, and the climate we live in —
              so what you wear is the scent the maker intended.
            </p>
          </motion.div>

          <div className="mt-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem] bg-[#1a0505] px-8 py-12 text-white shadow-[0_28px_70px_rgba(122,12,12,0.2)] sm:px-10 sm:py-16"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
              <p className="font-serif-luxury text-2xl leading-snug sm:text-3xl">
                “A fragrance should arrive as it was composed — authentic,
                sealed, and ready to live on skin.”
              </p>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200/80">
                Dedox Perfume · UAE
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-5 text-sm leading-relaxed text-gray-600 sm:text-base"
            >
              <p>
                We do not flood the shelf. Each house we carry is chosen for
                how it wears here: heat, air, and hours. Niche and luxury
                bottles sit together because they earn their place — not
                because a catalogue said they should.
              </p>
              <p>
                From first spray to the last drop, the promise is simple. Fast
                delivery from the UAE. 100% original juice. Secure checkout.
                And a Rewards programme that lets a collection earn the next
                bottle for you.
              </p>
              <Link
                href="/shop"
                className="btn-primary mt-2 inline-flex rounded-full px-7 py-3 text-[11px] font-black uppercase tracking-[0.18em]"
              >
                Shop the collection
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-[#fffaf8] py-14 sm:py-20">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h2 className="home-section-title">What we stand for</h2>
            <p className="home-section-subtitle">
              Three lines we will not cross — so you can collect with a quiet
              mind.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {pillars.map((item, idx) => (
              <motion.article
                key={item.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-[1.5rem] border border-[#7a0c0c]/10 bg-white px-5 py-7"
              >
                <p className="font-serif-luxury text-2xl text-[#7a0c0c]/25">{item.n}</p>
                <h3 className="mt-3 font-serif-luxury text-xl text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
