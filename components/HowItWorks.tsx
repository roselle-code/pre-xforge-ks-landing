"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { S } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
  "/placeholders/carousel-7.png",
  "/placeholders/carousel-6.png",
  "/placeholders/carousel-5.png",
  "/placeholders/carousel-1.png",
  "/placeholders/carousel-2.png",
  "/placeholders/carousel-3.png",
  "/placeholders/carousel-4.png",
  "/placeholders/carousel-8.png",
];

const FEATURES = [
  {
    title: "Use It Like Any Smartphone",
    description:
      "A familiar OS that supports all your favorite apps. Scrolling, gaming, or snapping photos, it feels exactly like the premium device you are used to.",
  },
  {
    title: "It Contributes in the Background",
    description:
      "While you live your life, XForge quietly shares idle computing resources with a decentralized network. Zero impact on performance.",
  },
  {
    title: "You Earn Rewards & Perks",
    description:
      "Your participation generates real value. Earn reward points redeemable for perks, discounts, and exclusive benefits in the ecosystem.",
  },
];

const RADIUS = 1100;
const PHOTO_COUNT = PHOTOS.length;
const ANGLE_STEP = 16;
const START_ANGLE = -((PHOTO_COUNT - 1) / 2) * ANGLE_STEP;
const TOTAL_ROTATION = -36;

const PHOTO_TOP_OFFSET = 60;
const INITIAL_ROTATION = 0;

function getPhotoStyle(index: number) {
  const angleDeg = START_ANGLE + index * ANGLE_STEP;
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = RADIUS * Math.sin(angleRad);
  const y = RADIUS * (1 - Math.cos(angleRad));
  return {
    left: `calc(50% + ${x}px - 110px)`,
    top: `${y + PHOTO_TOP_OFFSET}px`,
    transform: `rotate(${angleDeg}deg)`,
  };
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!triggerRef.current || !wheelRef.current) return;

    const trigger = triggerRef.current;
    const wheel = wheelRef.current;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.set(wheel, { rotation: INITIAL_ROTATION });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 0.33, 0.66, 1],
            duration: { min: 0.4, max: 0.8 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const step = Math.min(2, Math.floor(self.progress * 3));
            setActiveStep(step);
          },
        },
      });

      tl.to(wheel, { rotation: INITIAL_ROTATION + TOTAL_ROTATION, ease: "none" }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-white text-black">
      {/* Desktop layout — always in DOM so GSAP can clean up pinned elements */}
      <div ref={triggerRef} className="relative h-[100dvh] overflow-hidden hidden md:block">
        {/* Title */}
        <div className="pt-[24px] lg:pt-[40px] px-6 md:px-[40px] lg:px-[60px] text-center">
          <h2 className="text-[36px] lg:text-[44px] font-semibold leading-[1.1]">
            <span>How XForge </span>
            <span className="font-serif italic underline">Works?</span>
          </h2>
        </div>

        {/* Photo carousel area */}
        <div className="relative mt-[12px] lg:mt-[16px] mx-auto w-full h-[calc(100dvh-380px)] overflow-visible">

          {/* Circular wheel container -- rotates on scroll */}
          <div
            ref={wheelRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: `50% ${RADIUS + PHOTO_TOP_OFFSET}px` }}
          >
            {PHOTOS.map((src, i) => {
              const isCarousel2 = src.includes("carousel-2");
              return (
                <div
                  key={i}
                  className="absolute w-[180px] h-[200px] lg:w-[220px] lg:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0px_5px_4.8px_0px_rgba(0,0,0,0.25)]"
                  style={{
                    ...getPhotoStyle(i),
                    background:
                      "radial-gradient(ellipse at center top, #050505 0%, #141414 50%, #2a2a2a 62.5%, #404040 75%, #565656 87.5%, #6d6d6d 100%)",
                  }}
                >
                  <Image
                    src={src}
                    alt={`XForge photo ${i + 1}`}
                    width={220}
                    height={240}
                    className={`w-full h-full object-cover ${isCarousel2 ? "scale-[1.4]" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature text -- outside carousel, below photos */}
        <div className="max-w-[500px] lg:max-w-[600px] mx-auto px-6 mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <h3 className="text-[22px] lg:text-[28px] font-medium leading-[1.1] text-black mb-[12px] lg:mb-[17px]">
                {FEATURES[activeStep].title}
              </h3>
              <p className="text-sm lg:text-base font-normal leading-[1.3] text-[#4d4d4d]">
                {FEATURES[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Email subscription */}
        <div className="flex justify-center pt-4 lg:pt-6 pb-3">
          <EmailSubscription />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="block md:hidden">
        <MobileView />
      </div>
    </section>
  );
}

function MobileView() {
  const [activeStep, setActiveStep] = useState(0);
  const mobileTriggerRef = useRef<HTMLDivElement>(null);
  const mobileWheelRef = useRef<HTMLDivElement>(null);

  const mobileRadius = 600;
  const mobileAngleStep = 18;
  const mobilePhotoCount = 5;
  const mobileStartAngle = -((mobilePhotoCount - 1) / 2) * mobileAngleStep;
  const mobileTotalRotation = -(FEATURES.length - 1) * mobileAngleStep;

  useEffect(() => {
    if (!mobileTriggerRef.current || !mobileWheelRef.current) return;

    const trigger = mobileTriggerRef.current;
    const wheel = mobileWheelRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        pinSpacing: true,
        snap: {
          snapTo: [0, 0.5, 1],
          duration: { min: 0.2, max: 0.4 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const step = Math.min(2, Math.floor(self.progress * 3));
          setActiveStep(step);
        },
      },
    });

    tl.to(wheel, { rotation: mobileTotalRotation, ease: "none" }, 0);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === trigger) st.kill();
      });
    };
  }, [mobileTotalRotation]);

  return (
    <div ref={mobileTriggerRef} className="relative h-[100dvh] overflow-hidden bg-white flex flex-col justify-center pb-[90px]">
      <div className="px-4 sm:px-6">
        <h2 className="text-[20px] sm:text-[28px] font-semibold leading-[1.1] text-center mb-4 sm:mb-6">
          <span>How XForge </span>
          <span className="font-serif italic underline">Works?</span>
        </h2>
      </div>

      {/* Circular carousel */}
      <div className="relative overflow-visible mx-auto w-full h-[200px] sm:h-[240px] shrink-0">
        <div
          ref={mobileWheelRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: `50% ${mobileRadius}px` }}
        >
          {PHOTOS.slice(2, 2 + mobilePhotoCount).map((src, i) => {
            const angleDeg = mobileStartAngle + i * mobileAngleStep;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = mobileRadius * Math.sin(angleRad);
            const y = mobileRadius * (1 - Math.cos(angleRad));
            const photoW = 120;
            const isCarousel2 = src.includes("carousel-2");
            return (
              <div
                key={i}
                className="absolute w-[120px] h-[140px] sm:w-[160px] sm:h-[180px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0px_3px_4px_0px_rgba(0,0,0,0.2)]"
                style={{
                  left: `calc(50% + ${x}px - ${photoW / 2}px)`,
                  top: `${y + 16}px`,
                  transform: `rotate(${angleDeg}deg)`,
                  background:
                    "radial-gradient(ellipse at center top, #050505 0%, #141414 50%, #2a2a2a 62.5%, #404040 75%, #565656 87.5%, #6d6d6d 100%)",
                }}
              >
                <Image
                  src={src}
                  alt={`XForge photo ${i + 1}`}
                  width={160}
                  height={180}
                  className={`w-full h-full object-cover ${isCarousel2 ? "scale-[1.4]" : ""}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mt-4 mb-3 px-4">
        {FEATURES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeStep ? "bg-black w-6" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>

      {/* Feature text */}
      <div className="max-w-[500px] mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h3 className="text-[18px] sm:text-[22px] font-medium leading-[1.1] text-black mb-3">
              {FEATURES[activeStep].title}
            </h3>
            <p className="text-[14px] sm:text-base font-normal leading-[1.4] text-[#4d4d4d]">
              {FEATURES[activeStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Email subscription */}
      <div className="mt-5 flex justify-center px-4 sm:px-6">
        <EmailSubscription />
      </div>
    </div>
  );
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = touched && email.length > 0 && !isValidEmail(email);

  async function handleNotify() {
    setTouched(true);
    if (!isValidEmail(email)) {
      inputRef.current?.focus();
      return;
    }
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setEmail("");
    setTouched(false);
    window.open(
      "https://www.kickstarter.com/projects/xforgephone/xforge-the-phone-that-pays-it-forward/",
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="w-full max-w-[360px] sm:max-w-[465px]">
      <div
        className={`${S.emailWrap} flex items-center justify-between pl-4 pr-1.5 sm:pr-2 py-1.5 sm:py-2 ${
          showError ? "border-red-500" : "border-xforge-border"
        }`}
      >
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => e.key === "Enter" && handleNotify()}
          placeholder="name@domain.com"
          aria-label="Email address"
          aria-invalid={showError}
          className={`${S.emailField} text-base font-normal`}
        />
        <motion.button
          type="button"
          onClick={handleNotify}
          whileHover="wiggle"
          whileTap="wiggle"
          className={`${S.btnNotify} flex-shrink-0 flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-normal hover:scale-[1.04]`}
        >
          <motion.span
            variants={{ wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] } }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-block", transformOrigin: "center bottom" }}
          >
            Notify Me
          </motion.span>
          <motion.div
            variants={{ wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] } }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/placeholders/notify-icon.svg"
              alt=""
              width={20}
              height={20}
              className="w-4 sm:w-5 h-4 sm:h-5"
              aria-hidden="true"
            />
          </motion.div>
        </motion.button>
        <div className={S.insetShadow} />
      </div>
      <p className="text-[14px] sm:text-sm font-normal leading-[1.1] text-[#4d4d4d] text-center mt-3 sm:mt-4">
        Be the first to know when we launch on Kickstarter
      </p>
    </div>
  );
}
