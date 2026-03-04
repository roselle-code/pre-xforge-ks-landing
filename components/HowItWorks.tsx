// Scroll-driven "scatter" gallery — all photos visible, shuffling positions on scroll.
// Sticky viewport: as user scrolls, all 8 photos smoothly rearrange to new
// scattered positions/rotations/scales for each feature step. Text changes in center.
//
// Gallery versions (revert by name):
//   "circular"  — commit ba773d8
//   "crossfade" — commit f7cdaad
//   "scatter"   — this version

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FEATURES } from "./how-it-works/gallery-config";
import EmailSubscription from "./how-it-works/EmailSubscription";
import MobileGallery from "./how-it-works/MobileGallery";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Each photo has 3 scatter states (one per feature step).
// All photos are visible at all times — they rearrange on scroll.
const SCATTER_PHOTOS = [
  {
    src: "/placeholders/carousel-5.png",
    w: 180,
    h: 200,
    states: [
      { left: "3%", top: "2%", rotation: -14, scale: 0.85 },
      { left: "56%", top: "5%", rotation: 10, scale: 0.9 },
      { left: "60%", top: "0%", rotation: 6, scale: 0.88 },
    ],
  },
  {
    src: "/placeholders/carousel-6.png",
    w: 175,
    h: 195,
    states: [
      { left: "62%", top: "0%", rotation: 10, scale: 0.88 },
      { left: "3%", top: "3%", rotation: -12, scale: 0.85 },
      { left: "4%", top: "5%", rotation: -10, scale: 0.9 },
    ],
  },
  {
    src: "/placeholders/carousel-1.png",
    w: 185,
    h: 215,
    states: [
      { left: "0%", top: "38%", rotation: -8, scale: 0.88 },
      { left: "62%", top: "35%", rotation: 10, scale: 0.85 },
      { left: "56%", top: "40%", rotation: 8, scale: 0.88 },
    ],
  },
  {
    src: "/placeholders/carousel-3.png",
    w: 200,
    h: 240,
    states: [
      { left: "30%", top: "33%", rotation: 4, scale: 0.95 },
      { left: "28%", top: "28%", rotation: -5, scale: 1.0 },
      { left: "26%", top: "35%", rotation: 3, scale: 0.98 },
    ],
  },
  {
    src: "/placeholders/carousel-4.png",
    w: 170,
    h: 190,
    states: [
      { left: "66%", top: "36%", rotation: 12, scale: 0.82 },
      { left: "0%", top: "42%", rotation: -10, scale: 0.85 },
      { left: "64%", top: "33%", rotation: 7, scale: 0.85 },
    ],
  },
  {
    src: "/placeholders/carousel-2.png",
    w: 180,
    h: 210,
    states: [
      { left: "8%", top: "65%", rotation: -10, scale: 0.82 },
      { left: "58%", top: "60%", rotation: 8, scale: 0.85 },
      { left: "32%", top: "58%", rotation: -4, scale: 0.9 },
    ],
  },
  {
    src: "/placeholders/carousel-7.png",
    w: 170,
    h: 190,
    states: [
      { left: "40%", top: "64%", rotation: 5, scale: 0.8 },
      { left: "32%", top: "60%", rotation: -6, scale: 0.82 },
      { left: "5%", top: "60%", rotation: -10, scale: 0.82 },
    ],
  },
  {
    src: "/placeholders/carousel-8.png",
    w: 160,
    h: 180,
    states: [
      { left: "68%", top: "62%", rotation: -6, scale: 0.78 },
      { left: "8%", top: "65%", rotation: -8, scale: 0.8 },
      { left: "62%", top: "60%", rotation: 10, scale: 0.82 },
    ],
  },
];

const AUTO_PLAY_INTERVAL = 2500;
const AUTO_PLAY_RESUME_DELAY = 2000;
const SNAP_POINTS = [0, 1 / 3, 2 / 3, 1];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrolling = useRef(false);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    clearAutoTimer();
    autoTimerRef.current = setInterval(() => {
      const st = stRef.current;
      if (!st) return;
      const currentSnap = SNAP_POINTS.findIndex(
        (p) => Math.abs(st.progress - p) < 0.05
      );
      const nextIndex =
        currentSnap < SNAP_POINTS.length - 1 ? currentSnap + 1 : 0;
      const targetScroll =
        st.start + SNAP_POINTS[nextIndex] * (st.end - st.start);
      isAutoScrolling.current = true;
      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          isAutoScrolling.current = false;
        },
      });
    }, AUTO_PLAY_INTERVAL);
  }, [clearAutoTimer]);

  const pauseAndResume = useCallback(() => {
    if (isAutoScrolling.current) return;
    clearAutoTimer();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      startAutoPlay();
    }, AUTO_PLAY_RESUME_DELAY);
  }, [clearAutoTimer, startAutoPlay]);

  const goToStep = useCallback(
    (stepIndex: number) => {
      const st = stRef.current;
      if (!st) return;
      const targetScroll =
        st.start + SNAP_POINTS[stepIndex] * (st.end - st.start);
      clearAutoTimer();
      isAutoScrolling.current = true;
      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          isAutoScrolling.current = false;
          startAutoPlay();
        },
      });
    },
    [clearAutoTimer, startAutoPlay]
  );

  useEffect(() => {
    if (!triggerRef.current) return;
    const trigger = triggerRef.current;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const els = photoRefs.current;

      // Set initial scatter positions (state 0)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        gsap.set(els[i]!, photo.states[0]);
      });

      // Timeline: photos rearrange between states
      const tl = gsap.timeline();

      // State 0 → State 1 (timeline 0 → 1)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        tl.to(
          els[i]!,
          { ...photo.states[1], duration: 1, ease: "power2.inOut" },
          0
        );
      });

      // State 1 → State 2 (timeline 1 → 2)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        tl.to(
          els[i]!,
          { ...photo.states[2], duration: 1, ease: "power2.inOut" },
          1
        );
      });

      // Rest period (timeline 2 → 3)
      tl.to({}, { duration: 1 }, 2);

      const scrollTrigger = ScrollTrigger.create({
        trigger,
        animation: tl,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.4, max: 0.8 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const step = Math.min(2, Math.floor(self.progress * 3));
          setActiveStep(step);
        },
        onEnter: () => startAutoPlay(),
        onLeave: () => clearAutoTimer(),
        onEnterBack: () => startAutoPlay(),
        onLeaveBack: () => clearAutoTimer(),
      });

      stRef.current = scrollTrigger;

      const onUserScroll = () => pauseAndResume();
      window.addEventListener("wheel", onUserScroll, { passive: true });
      window.addEventListener("touchmove", onUserScroll, { passive: true });

      return () => {
        window.removeEventListener("wheel", onUserScroll);
        window.removeEventListener("touchmove", onUserScroll);
        clearAutoTimer();
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      };
    });

    return () => mm.revert();
  }, [startAutoPlay, clearAutoTimer, pauseAndResume]);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-white text-black">
      {/* Desktop: sticky viewport with shuffling scatter photos */}
      <div ref={triggerRef} className="relative min-h-[350vh] hidden md:block">
        <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col">
          {/* Title */}
          <div className="pt-[24px] lg:pt-[40px] text-center shrink-0">
            <h2 className="text-[36px] lg:text-[44px] font-semibold leading-[1.1]">
              <span>How XForge </span>
              <span className="font-serif italic underline">Works</span>
            </h2>
          </div>

          {/* Gallery area — photos + centered text + email */}
          <div className="relative flex-1 mx-auto w-full max-w-[950px] mt-3">
            {/* Scattered photos */}
            {SCATTER_PHOTOS.map((photo, i) => (
              <div
                key={i}
                ref={(el) => {
                  photoRefs.current[i] = el;
                }}
                className="absolute rounded-2xl overflow-hidden shadow-[0px_5px_15px_rgba(0,0,0,0.2)] will-change-transform"
                style={{ width: photo.w, height: photo.h }}
              >
                <Image
                  src={photo.src}
                  alt={`XForge photo ${i + 1}`}
                  width={photo.w}
                  height={photo.h}
                  className="w-full h-full object-cover"
                  style={
                    photo.src.includes("carousel-4")
                      ? { objectPosition: "35% center" }
                      : undefined
                  }
                />
              </div>
            ))}

            {/* Feature text — centered on top of photos */}
            <div className="absolute inset-0 z-10 flex items-start justify-center pointer-events-none pt-[16%]">
              <div className="max-w-[420px] text-center pointer-events-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="text-[24px] lg:text-[30px] font-medium leading-[1.1] text-black mb-[14px]">
                      {FEATURES[activeStep].title}
                    </h3>
                    <p className="text-sm lg:text-base font-normal leading-[1.4] text-[#4d4d4d]">
                      {FEATURES[activeStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Step indicators */}
            <div className="absolute bottom-[120px] left-0 right-0 z-10 flex justify-center gap-2">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to step ${i + 1}`}
                  onClick={() => goToStep(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeStep ? "bg-black w-6" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>

            {/* Email subscription at bottom */}
            <div className="absolute bottom-4 lg:bottom-6 left-0 right-0 z-10 flex justify-center">
              <EmailSubscription />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="block md:hidden">
        <MobileGallery />
      </div>
    </section>
  );
}
