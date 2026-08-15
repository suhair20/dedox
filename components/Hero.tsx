import Image from "next/image";

/** Desktop wide banner — export at 2400 × 800 px (3:1). */
const HERO_DESKTOP = "/images/herosection/websitee banner.jpg.jpeg";

/** Phone banner — public/website banner(phone)1.jpg.jpeg */
const HERO_MOBILE = "/website banner(phone)1.jpg.jpeg";

export default function Hero() {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="relative aspect-[4/5] w-full max-h-[70vh] md:hidden">
        <Image
          src={HERO_MOBILE}
          alt="Dedox Perfume banner"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <Image
        src={HERO_DESKTOP}
        alt="Dedox Perfume banner"
        width={2400}
        height={800}
        priority
        sizes="100vw"
        className="hidden h-auto w-full md:block"
      />
    </section>
  );
}
