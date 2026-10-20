import Image from "next/image";

const HERO_BANNER_PHONE = "/images/herosection/phone website design 1.jpg.jpeg";
const HERO_BANNER_LAPTOP = "/images/herosection/lap website design.jpg.jpeg";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#3a0a0c]">
      <Image
        src={HERO_BANNER_PHONE}
        alt="Dedox Perfume banner"
        width={1080}
        height={1350}
        priority
        unoptimized
        sizes="100vw"
        className="h-auto w-full md:hidden"
      />
      <Image
        src={HERO_BANNER_LAPTOP}
        alt="Dedox Perfume banner"
        width={2400}
        height={800}
        priority
        unoptimized
        sizes="100vw"
        className="hidden h-auto w-full md:block"
      />
    </section>
  );
}
