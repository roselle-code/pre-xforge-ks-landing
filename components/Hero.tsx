"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const HERO_FEATURES = [
  {
    icon: "/placeholders/build-icon.svg",
    title: "Premium Build",
    subtitle: "Built to last",
    position: "top-left" as const,
  },
  {
    icon: "/placeholders/camera-icon.svg",
    title: "64MP AI Camera",
    subtitle: "AI-enhanced photography",
    position: "top-right" as const,
  },
  {
    icon: "/placeholders/core-icon.svg",
    title: "Octa-Core Power",
    subtitle: "Silky-smooth multitasking on Android 15.",
    position: "bottom-left" as const,
  },
  {
    icon: "/placeholders/battery-icon.svg",
    title: "5000mAh Battery",
    subtitle: "Never worry about running out.",
    position: "bottom-right" as const,
  },
];

const POSITION_CLASSES: Record<string, string> = {
  "top-left": "left-[8px] sm:left-[20px] lg:left-[50px] top-[58px] w-[129px] sm:w-[200px] lg:w-[221px]",
  "top-right": "right-[8px] sm:right-[10px] lg:right-[27px] top-0 w-[168px] sm:w-[220px] lg:w-[254px]",
  "bottom-left":
    "left-[8px] sm:left-0 top-auto bottom-[75px] sm:bottom-[40px] lg:bottom-0 w-[150px] sm:w-[260px] lg:w-[338px]",
  "bottom-right":
    "right-[8px] sm:right-0 top-auto bottom-[20px] sm:bottom-[30px] lg:bottom-[46px] w-[140px] sm:w-[240px] lg:w-[283px]",
};

const CARD_ORIGINS: Record<string, { x: number; y: number }> = {
  "top-left": { x: -40, y: -20 },
  "top-right": { x: 40, y: -20 },
  "bottom-left": { x: -40, y: 20 },
  "bottom-right": { x: 40, y: 20 },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const phoneVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

function cardVariants(position: string): Variants {
  const origin = CARD_ORIGINS[position];
  return {
    hidden: { opacity: 0, x: origin.x, y: origin.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

function echoVariants(position: string): Variants {
  const origin = CARD_ORIGINS[position];
  return {
    hidden: { opacity: 0, x: origin.x * 1.3, y: origin.y * 1.3, scale: 0.92 },
    visible: {
      opacity: [0, 0.4, 0],
      x: [origin.x * 1.3, origin.x * 0.3, 0],
      y: [origin.y * 1.3, origin.y * 0.3, 0],
      scale: [0.92, 0.97, 1],
      transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full bg-xforge-black overflow-hidden"
    >
      {/* Notification Bar */}
      <div className="w-full bg-xforge-dark flex items-center justify-center px-4 py-3">
        <p className="text-xforge-gold text-[14px] sm:text-sm lg:text-base font-normal leading-[1.1] text-center">
          Launching soon on Kickstarter • Early-bird perks • 100% refundable
          deposit
        </p>
      </div>

      {/* Hero Content */}
      <div className="relative flex flex-col items-center pt-8 sm:pt-10 lg:pt-[57px] pb-24 sm:pb-26 lg:pb-28">
        {/* Title -- single line on desktop */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="text-center text-[36px] sm:text-[44px] md:text-[48px] lg:text-[60px] font-semibold leading-[1.1] px-4 lg:whitespace-nowrap"
        >
          <span className="text-white">The Phone that </span>
          <span className="font-serif italic text-xforge-gold">
            Pays You Back
          </span>
        </motion.h1>

        {/* Phone + Feature Cards Container */}
        <div className="relative mt-10 sm:mt-14 lg:mt-21 w-full max-w-[763px] mx-auto px-4 sm:px-6 lg:px-0 h-[420px] sm:h-[460px] md:h-[490px] lg:h-[524px]">
          {/* Glow effect behind phone */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[380px] lg:w-[450px] h-[120px] sm:h-[140px] lg:h-[165px] opacity-60 pointer-events-none">
            <Image
              src="/placeholders/hero-glow.svg"
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>

          {/* Phone Image -- floating idle + screen glow on hover */}
          <PhoneHero />

          {/* Feature Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="absolute inset-0"
          >
            {HERO_FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhoneHero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={phoneVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsHovered(true)}
      onTap={() => setTimeout(() => setIsHovered(false), 800)}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[350px] sm:w-[260px] sm:h-[410px] md:w-[310px] md:h-[460px] lg:w-[368px] lg:h-[514px] z-10 cursor-pointer"
    >
      {/* Screen glow -- expands on hover */}
      <motion.div
        animate={
          isHovered
            ? {
                opacity: [0.3, 0.7, 0.55],
                scale: [1, 1.25, 1.15],
              }
            : { opacity: 0.15, scale: 1 }
        }
        transition={
          isHovered
            ? { duration: 0.6, ease: "easeOut" }
            : { duration: 0.8, ease: "easeInOut" }
        }
        className="absolute inset-[-30%] pointer-events-none rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,188,14,0.35) 0%, rgba(255,188,14,0.1) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Floating idle animation */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="relative w-full h-full will-change-transform"
      >
        {/* Magnetic lean toward cursor on hover */}
        <motion.div
          animate={
            isHovered
              ? { scale: 1.03, rotateZ: -1 }
              : { scale: 1, rotateZ: 0 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full h-full"
        >
          <Image
            src="/placeholders/phone-hero.png"
            alt="XForge Phone"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface FeatureCardProps {
  feature: (typeof HERO_FEATURES)[number];
}

function FeatureCard({ feature }: FeatureCardProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`absolute ${POSITION_CLASSES[feature.position]}`}>
      {/* Echo / ghost trail behind the card */}
      <motion.div
        variants={echoVariants(feature.position)}
        className="absolute inset-0 rounded-[22px] border border-white/30 pointer-events-none"
        style={{
          background:
            "linear-gradient(173deg, rgba(58,58,58,0.4) 12.4%, rgba(0,0,0,0.3) 99%)",
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Main card */}
      <motion.div
        variants={cardVariants(feature.position)}
        onHoverStart={() => setIsActive(true)}
        onHoverEnd={() => setIsActive(false)}
        onTapStart={() => setIsActive(true)}
        onTap={() => setTimeout(() => setIsActive(false), 600)}
        whileHover={{
          scale: 1.05,
          boxShadow:
            "0.933px 1.866px 16px 4px rgba(255,248,145,0.25), 0 0 24px 2px rgba(255,188,14,0.12)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative cursor-pointer z-20 border border-white/30 rounded-[16px] sm:rounded-[20px] lg:rounded-[22px] p-3 sm:p-4 lg:p-5 backdrop-blur-sm shadow-[0.933px_1.866px_11.57px_1.866px_rgba(255,248,145,0.13)]"
        style={{
          background:
            "linear-gradient(173deg, rgba(58,58,58,0.73) 12.4%, rgba(0,0,0,0.73) 99%)",
        }}
      >
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Icon with glow on interaction */}
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8">
            {/* Glow ring behind icon */}
            <motion.div
              animate={
                isActive
                  ? {
                      opacity: [0, 0.8, 0.6],
                      scale: [0.6, 1.6, 1.4],
                    }
                  : { opacity: 0, scale: 0.6 }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-[-8px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,188,14,0.5) 0%, rgba(255,188,14,0) 70%)",
              }}
              aria-hidden="true"
            />
            <motion.div
              animate={
                isActive
                  ? { filter: "drop-shadow(0 0 8px rgba(255,188,14,0.9))" }
                  : { filter: "drop-shadow(0 0 0px rgba(255,188,14,0))" }
              }
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Image
                src={feature.icon}
                alt=""
                width={32}
                height={32}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                aria-hidden="true"
              />
            </motion.div>
          </div>
          <div className="flex flex-col gap-1 leading-[1.3] text-white">
            <p className="font-semibold text-[14px] sm:text-[15px] lg:text-[17px]">{feature.title}</p>
            <p className="font-normal text-white/80 text-[12px] sm:text-[13px] lg:text-[15px]">{feature.subtitle}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
