import Image from "next/image";

const HERO_BANNER = "/images/herosection/lap website design.jpg.jpeg";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#3a0a0c]">
      <Image
        src={HERO_BANNER}
        alt="Dedox Perfume banner"
        width={2400}
        height={800}
        priority
        unoptimized
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
}
