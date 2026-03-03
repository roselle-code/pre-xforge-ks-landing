"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";

function useLiveCounter(startValue: number, isActive: boolean) {
  const [value, setValue] = useState(startValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setValue((prev) => prev + Math.floor(Math.random() * 80) + 20);
      }, 300);
    } else {
      clear();
    }
    return clear;
  }, [isActive, clear]);

  return value;
}

const CARD_ANGLE = {
  rotate: -3.78,
  skewX: 3.73,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rewardElevate = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE, delay: 0.5 },
  },
};

const backCardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.2 },
  },
};

const midCardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.35 },
  },
};

const cardTransform = `rotate(${CARD_ANGLE.rotate}deg) skewX(${CARD_ANGLE.skewX}deg)`;

export default function WhyDifferent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const [hasAppeared, setHasAppeared] = useState(false);
  const rewardCount = useLiveCounter(6367200, isInView && hasAppeared);

  useEffect(() => {
    if (isInView && !hasAppeared) setHasAppeared(true);
  }, [isInView, hasAppeared]);

  return (
    <section
      ref={sectionRef}
      id="why-different"
      className="w-full bg-xforge-black py-6 sm:py-10 lg:py-[48px]"
    >
      <div className="max-w-[1096px] mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row items-center gap-4 sm:gap-6 lg:gap-5">
        {/* Phone + Reward Cards wrapper */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="relative w-full sm:w-[400px] md:w-[460px] lg:w-[532px] h-[358px] sm:h-[380px] md:h-[420px] lg:h-[532px] flex-shrink-0"
        >
          {/* Mobile phone image — rotated and cropped like Figma */}
          <div className="absolute inset-0 rounded-[16px] overflow-hidden bg-xforge-black lg:hidden">
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "-85px",
                width: "612px",
                height: "815px",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ transform: "rotate(11.52deg)" }}>
                <Image
                  src="/placeholders/xforge-widget.png"
                  alt="XForge phone showing network rewards"
                  width={475}
                  height={735}
                  className="max-w-none"
                />
              </div>
            </div>
          </div>

          {/* Desktop phone image — overflow hidden crops the phone */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-xforge-black hidden lg:block">
            <div
              className="absolute"
              style={{
                left: "-158px",
                top: "-120px",
                width: "903px",
                height: "1210px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ transform: "rotate(11.52deg)" }}>
                <Image
                  src="/placeholders/xforge-widget.png"
                  alt="XForge phone showing network rewards"
                  width={699}
                  height={1092}
                  className="max-w-none"
                />
              </div>
            </div>
          </div>

          {/* ===== Desktop reward cards (lg+) ===== */}

          {/* Desktop back card */}
          <div
            className="hidden lg:block absolute z-10 w-[326px]"
            style={{
              left: "calc(54% - 163px)",
              top: "calc(50% - 55px)",
              transform: cardTransform,
              filter: "blur(1.86px)",
            }}
          >
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={backCardReveal}>
              <div className="bg-xforge-card-bg/90 backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[14px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[#686c81] text-[17px]">Network Rewards</span>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex rounded-full h-[11px] w-[11px] bg-xforge-green" />
                    <span className="text-xforge-green text-[17px]">Node is Running</span>
                  </div>
                </div>
                <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-xl p-3 flex items-center justify-center">
                  <span className="font-display font-bold text-xforge-gold text-[43px] leading-[1.1]">6,367,200</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop mid card */}
          <div
            className="hidden lg:block absolute z-20 w-[326px]"
            style={{
              left: "calc(58% - 163px)",
              top: "calc(47% - 55px)",
              transform: cardTransform,
              filter: "blur(0.93px)",
            }}
          >
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={midCardReveal}>
              <div className="bg-xforge-card-bg/90 backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[14px] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[#686c81] text-[17px]">Network Rewards</span>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex rounded-full h-[11px] w-[11px] bg-xforge-green" />
                    <span className="text-xforge-green text-[17px]">Node is Running</span>
                  </div>
                </div>
                <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-xl p-3 flex items-center justify-center">
                  <span className="font-display font-bold text-xforge-gold text-[43px] leading-[1.1]">6,367,200</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop front card */}
          <div
            className="hidden lg:block absolute z-30 w-[326px]"
            style={{
              left: "calc(61% - 163px)",
              top: "calc(43% - 55px)",
              transform: cardTransform,
            }}
          >
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rewardElevate}>
              <div className="bg-xforge-card-bg3 backdrop-blur-md border border-[#bdbdbd]/40 rounded-[14px] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <div className="flex items-start mb-3">
                  <span className="text-[#aeb2c7] text-[17px]">Network Rewards</span>
                </div>
                <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-xl p-3 flex items-center justify-center">
                  <span className="font-display font-bold text-xforge-gold text-[43px] leading-[1.1] tabular-nums">
                    {rewardCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== Mobile reward cards (<lg) ===== */}

          {/* Mobile back card */}
          <div
            className="block lg:hidden absolute z-10 w-[220px]"
            style={{
              left: "calc(50% - 93px)",
              top: "calc(50% - 91px)",
              transform: cardTransform,
              filter: "blur(1.25px)",
            }}
          >
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={backCardReveal}>
              <div className="bg-xforge-card-bg backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[9px] p-[11px] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <div className="flex items-start justify-between mb-[7px]">
                  <span className="text-[#686c81] text-[11px]">Network Rewards</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full h-[7px] w-[7px] bg-xforge-green" />
                    <span className="text-xforge-green text-[11px]">Node is Running</span>
                  </div>
                </div>
                <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-[8px] p-[7px] h-[53px] flex items-center justify-center">
                  <span className="font-display font-bold text-xforge-gold text-[29px] leading-[1.1]">6,367,200</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile mid card */}
          <div
            className="block lg:hidden absolute z-20 w-[220px]"
            style={{
              left: "calc(50% - 82px)",
              top: "calc(50% - 103px)",
              transform: cardTransform,
              filter: "blur(0.63px)",
            }}
          >
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={midCardReveal}>
              <div className="bg-xforge-card-bg backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[9px] p-[11px] shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between mb-[7px]">
                  <span className="text-[#686c81] text-[11px]">Network Rewards</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full h-[7px] w-[7px] bg-xforge-green" />
                    <span className="text-xforge-green text-[11px]">Node is Running</span>
                  </div>
                </div>
                <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-[8px] p-[7px] h-[53px] flex items-center justify-center">
                  <span className="font-display font-bold text-xforge-gold text-[29px] leading-[1.1]">6,367,200</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile front card */}
          <div
            className="block lg:hidden absolute z-30 w-[220px]"
            style={{
              left: "calc(50% - 71px)",
              top: "calc(50% - 117px)",
              transform: cardTransform,
            }}
          >
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rewardElevate}>
              <div className="bg-xforge-card-bg3 backdrop-blur-md border border-[#bdbdbd]/40 rounded-[9px] p-[11px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <div className="flex items-start mb-[7px]">
                  <span className="text-[#aeb2c7] text-[11px]">Network Rewards</span>
                </div>
                <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-[8px] p-[7px] h-[53px] flex items-center justify-center">
                  <span className="font-display font-bold text-xforge-gold text-[29px] leading-[1.1] tabular-nums">
                    {rewardCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Info Container */}
        <div className="flex-1 min-w-0 flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-[48px] text-center lg:text-left">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-semibold leading-[1.1]"
          >
            <span className="text-white">Why XForge is </span>
            <span className="font-serif italic text-xforge-gold">
              Different
            </span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-medium leading-[1.1] text-white mb-3 sm:mb-4">
              Passive Contribution, Real Rewards
            </h3>
            <p className="text-[14px] sm:text-sm lg:text-base font-normal leading-[1.3] text-xforge-gray max-w-[486px]">
              XForge works just like any other smartphone, with no learning
              curve or new habits to adopt, while quietly supporting a shared
              network in the background to earn you points, perks, and future
              benefits.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-[35px]"
          >
            <div className="flex items-center gap-4 lg:gap-5">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4">
                <span className="animate-ping absolute inset-0 rounded-full bg-xforge-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 bg-xforge-green" />
              </span>
              <span className="text-xforge-green text-[14px] sm:text-[16px] lg:text-[24px] leading-[1.1]">
                Node is Running
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p
                className="text-[20px] sm:text-[22px] lg:text-[32px] font-medium leading-[1.1] text-xforge-gold"
                style={{
                  textShadow:
                    "0 0 20px rgba(255,188,14,0.4), 0 0 40px rgba(255,188,14,0.2)",
                }}
              >
                24/7
              </p>
              <p className="text-[14px] sm:text-sm lg:text-base font-normal leading-[1.3] text-xforge-gray">
                Auto Earning
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
