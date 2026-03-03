"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { KICKSTARTER_URL, S } from "@/lib/animations";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function FloatingNav() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = touched && email.length > 0 && !isValidEmail(email);

  async function handleNotifyClick() {
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
    } catch {
      // Silently fail -- don't block the redirect
    }

    setEmail("");
    setTouched(false);
    window.open(KICKSTARTER_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      className="fixed bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-[874px]"
      aria-label="Main navigation"
    >
      {/* Desktop layout: logo + email + reserve in a row */}
      <div className="hidden md:flex bg-white border border-black rounded-2xl shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)] items-center justify-between pl-4 pr-2 py-2">
        <div className="shrink-0">
          <div className="hidden lg:flex items-center">
            <Image
              src="/placeholders/nav-logos.svg"
              alt="XForge × Kickstarter"
              width={319}
              height={24}
            />
          </div>
          <div className="flex lg:hidden items-center">
            <Image
              src="/placeholders/xforge-logo.svg"
              alt="XForge"
              width={100}
              height={24}
              className="invert"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`${S.emailWrap} flex items-center pl-3 lg:pl-4 pr-1 py-1 h-[40px] lg:h-[44px] w-[240px] lg:w-[308px] ${
              showError ? "border-red-500" : "border-xforge-border"
            }`}
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={(e) => e.key === "Enter" && handleNotifyClick()}
              placeholder="name@domain.com"
              aria-label="Email address"
              aria-invalid={showError}
              className={`${S.emailField} text-sm lg:text-base font-normal`}
            />
            <motion.button
              type="button"
              onClick={handleNotifyClick}
              whileHover="wiggle"
              whileTap="wiggle"
              className={`${S.btnNotify} flex items-center gap-1.5 lg:gap-2 px-3 lg:px-5 h-[32px] lg:h-[34px] rounded-[12px] text-sm lg:text-base font-medium hover:scale-[1.04] shrink-0`}
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
                <Image src="/placeholders/notify-icon.svg" alt="" width={20} height={20} className="w-4 lg:w-5 h-4 lg:h-5" aria-hidden="true" />
              </motion.div>
            </motion.button>
            <div className={S.insetShadow} />
          </div>
          <motion.a
            href="/reserve"
            whileHover="wiggle"
            whileTap="wiggle"
            className={`${S.btnGold} flex items-center gap-2 px-5 h-[44px] rounded-[12px] text-base font-medium shrink-0 hover:scale-[1.04]`}
          >
            <motion.span
              variants={{ wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] } }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline-block", transformOrigin: "center bottom" }}
            >
              Reserve for $3
            </motion.span>
            <motion.div
              variants={{ wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] } }}
              transition={{ duration: 0.5 }}
            >
              <Image src="/placeholders/arrow-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
            </motion.div>
          </motion.a>
        </div>
      </div>

      {/* Mobile layout: logos on top, email input + reserve button in a row below */}
      <div className="flex md:hidden bg-white border border-black rounded-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)] flex-col items-center gap-1.5 px-2 py-2.5">
        {/* Logos */}
        <Image
          src="/placeholders/nav-logos.svg"
          alt="XForge × Kickstarter"
          width={200}
          height={16}
          className="h-[16px] w-auto"
        />

        {/* Email + Reserve row */}
        <div className="flex items-center gap-1.5 w-full">
          <div
            className={`${S.emailWrap} flex flex-1 min-w-0 items-center pl-3 pr-1 py-1 h-[40px] ${
              showError ? "border-red-500" : "border-xforge-border"
            }`}
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={(e) => e.key === "Enter" && handleNotifyClick()}
              placeholder="name@domain.com"
              aria-label="Email address"
              aria-invalid={showError}
              className={`${S.emailField} text-sm font-normal`}
            />
            <motion.button
              type="button"
              onClick={handleNotifyClick}
              whileHover="wiggle"
              whileTap="wiggle"
              className={`${S.btnNotify} flex items-center justify-center px-3 h-[30px] rounded-[10px] hover:scale-[1.04] shrink-0`}
            >
              <motion.div
                variants={{ wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] } }}
                transition={{ duration: 0.5 }}
              >
                <Image src="/placeholders/notify-icon.svg" alt="" width={18} height={18} className="w-[18px] h-[18px]" aria-hidden="true" />
              </motion.div>
            </motion.button>
            <div className={S.insetShadow} />
          </div>

          <motion.a
            href="/reserve"
            whileHover="wiggle"
            whileTap="wiggle"
            className={`${S.btnGold} flex items-center justify-center gap-1.5 px-3 h-[40px] rounded-[12px] text-[13px] font-medium shrink-0 whitespace-nowrap hover:scale-[1.02]`}
          >
            <motion.span
              variants={{ wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] } }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline-block", transformOrigin: "center bottom" }}
            >
              Reserve $3
            </motion.span>
            <motion.div
              variants={{ wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] } }}
              transition={{ duration: 0.5 }}
            >
              <Image src="/placeholders/arrow-icon.svg" alt="" width={16} height={16} className="w-4 h-4" aria-hidden="true" />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
