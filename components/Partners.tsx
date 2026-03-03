"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Razer", src: "/placeholders/logos/razer.svg", w: 228, h: 35 },
  { name: "Saison Capital", src: "/placeholders/logos/saison-capital.png", w: 155, h: 79 },
  { name: "Dragonfly", src: "/placeholders/logos/dragonfly.svg", w: 254, h: 23 },
  { name: "CoinFund", src: "/placeholders/logos/coinfund.svg", w: 223, h: 39 },
  { name: "Drip", src: "/placeholders/logos/drip.svg", w: 198, h: 35 },
  { name: "Huddle01", src: "/placeholders/logos/huddle01.png", w: 198, h: 37 },
  { name: "Dogecoin", src: "/placeholders/logos/dogecoin-group.svg", w: 198, h: 61 },
  { name: "Zephyrus Capital", src: "/placeholders/logos/zephyrus-capital.svg", w: 168, h: 75 },
  { name: "YGG", src: "/placeholders/logos/ygg.svg", w: 159, h: 79 },
  { name: "Animoca Brands", src: "/placeholders/logos/animoca-brands.png", w: 138, h: 83 },
  { name: "Helium Deploy", src: "/placeholders/logos/helium-deploy.png", w: 197, h: 39 },
  { name: "MSA", src: "/placeholders/logos/msa.png", w: 202, h: 85 },
  { name: "RBV", src: "/placeholders/logos/rbv.png", w: 89, h: 83 },
  { name: "Caballeros Capital", src: "/placeholders/logos/caballeros-capital.png", w: 178, h: 75 },
  { name: "Stream", src: "/placeholders/logos/stream.svg", w: 212, h: 37 },
  { name: "EaseFlow", src: "/placeholders/logos/easeflow.svg", w: 215, h: 33 },
  { name: "Founder Heads", src: "/placeholders/logos/founders-heads-a.svg", w: 172, h: 61 },
  { name: "Nolcha Shows", src: "/placeholders/logos/nolcha-shows.png", w: 190, h: 65 },
  { name: "NodeOps", src: "/placeholders/logos/nodeops-text.svg", w: 196, h: 51 },
  { name: "Aethir", src: "/placeholders/logos/aethir.svg", w: 206, h: 43 },
  { name: "DePIN Alliance", src: "/placeholders/logos/depin-alliance.svg", w: 115, h: 77 },
  { name: "Ampchampment", src: "/placeholders/logos/ampchampment.png", w: 150, h: 77 },
  { name: "Gede Esports", src: "/placeholders/logos/gede-esports.svg", w: 172, h: 67 },
  { name: "aPhone", src: "/placeholders/logos/aphone.png", w: 156, h: 61 },
  { name: "DePIN Hub", src: "/placeholders/logos/depin-hub.svg", w: 196, h: 43 },
  { name: "Boxmining", src: "/placeholders/logos/boxmining.png", w: 216, h: 71 },
  { name: "Cogitent Ventures", src: "/placeholders/logos/cogitent-ventures.png", w: 183, h: 61 },
  { name: "BitDoctor", src: "/placeholders/logos/bitdoctor.png", w: 221, h: 44 },
];

function PartnerLogo({ partner }: { partner: (typeof PARTNERS)[number] }) {
  const maxH = 36;
  const scale = maxH / partner.h;
  const displayW = Math.round(partner.w * scale);
  const displayH = Math.round(partner.h * scale);

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex-shrink-0 flex items-center justify-center px-2 sm:px-3 lg:px-5 will-change-transform"
    >
      <Image
        src={partner.src}
        alt={partner.name}
        width={displayW}
        height={displayH}
        className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
      />
    </motion.div>
  );
}

export default function Partners() {
  return (
    <section className="w-full bg-black py-8 sm:py-10 md:py-16 lg:py-[106px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[147px] flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 md:gap-0">
        {/* Left: Description text */}
        <p className="text-[20px] sm:text-xl md:text-[26px] lg:text-[32px] font-semibold leading-[1.1] md:w-[350px] lg:w-[431px] shrink-0 text-center md:text-left">
          <span className="font-serif italic text-xforge-gold">
            World-class partners
          </span>
          <span className="text-white">
            {" "}
            bring elite mobile power to your pocket.
          </span>
        </p>

        {/* Right: Logo marquee */}
        <div
          className="flex-1 min-w-0 relative"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div className="flex w-max animate-marquee">
            <div className="flex items-center">
              {PARTNERS.map((p) => (
                <PartnerLogo key={`a-${p.name}`} partner={p} />
              ))}
            </div>
            <div className="flex items-center" aria-hidden="true">
              {PARTNERS.map((p) => (
                <PartnerLogo key={`b-${p.name}`} partner={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
