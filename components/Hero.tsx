import Image from "next/image";

const HERO_BANNER = "/images/herosection/websitee banner.jpg.jpeg";

export default function Hero() {
  return (
    <section className="w-full">
      <Image
        src={HERO_BANNER}
        alt="Dedox Perfume banner"
        width={2400}
        height={800}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />
    </section>
  );
}
