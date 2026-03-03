"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, KICKSTARTER_URL, S } from "@/lib/animations";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Footer() {
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
    window.open(KICKSTARTER_URL, "_blank", "noopener,noreferrer");
  }
  return (
    <footer className="relative w-full bg-xforge-black overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none footer-pattern"
        aria-hidden="true"
      />
      {/* Top gradient fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, rgba(5,5,5,0) 20%, rgba(5,5,5,0) 90%, #050505 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[874px] mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-[52px] pb-40 sm:pb-36 lg:pb-32 flex flex-col items-center gap-8 lg:gap-[60px]">
        {/* Top section */}
        <div className="flex flex-col items-center gap-10 lg:gap-[84px] w-full">
          {/* Logo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Image
              src="/placeholders/footer-logo.svg"
              alt="XForge × Kickstarter"
              width={424}
              height={32}
              className="max-w-[280px] sm:max-w-[313px] lg:max-w-full h-auto"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 w-full"
          >
            <h2 className="text-[32px] lg:text-[44px] font-semibold leading-[1.1] text-white text-center">
              Reserve your spot
            </h2>

            {/* Email + Buttons */}
            <div className="flex flex-col items-stretch gap-2 w-full max-w-[353px] sm:max-w-[400px] lg:max-w-none lg:flex-row lg:items-center lg:w-auto">
              {/* Email input + Notify Me (always in one row) */}
              <div className={`flex items-center border rounded-[12px] pl-4 pr-1 lg:pr-2 py-1 lg:py-2 h-[48px] lg:h-[60px] w-full lg:w-auto transition-colors duration-200 ${showError ? "border-red-500" : "border-[#3d3d3d]"}`}>
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
                  className="bg-transparent text-base font-normal text-xforge-placeholder leading-[1.1] outline-none flex-1 min-w-0 lg:w-[160px]"
                />
                <motion.button
                  type="button"
                  onClick={handleNotify}
                  whileHover="wiggle"
                  whileTap="wiggle"
                  className={`${S.btnNotify} flex items-center gap-2 px-5 h-[40px] lg:h-auto lg:py-3 rounded-[12px] text-base font-normal hover:scale-[1.04] shrink-0`}
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
              </div>

              {/* Reserve button — full width on mobile/tablet */}
              <motion.a
                href="/reserve"
                whileHover="wiggle"
                whileTap="wiggle"
                className={`${S.btnGold} flex items-center justify-center gap-2 px-5 h-[48px] lg:h-auto lg:py-3 rounded-[16px] lg:rounded-xl text-base font-normal hover:scale-[1.04] w-full lg:w-auto lg:shrink-0`}
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
                  <Image
                    src="/placeholders/arrow-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="w-4 sm:w-5 h-4 sm:h-5"
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.a>
            </div>

            {/* Early bird text */}
            <p className="text-[14px] sm:text-sm font-normal leading-[1.1] text-center">
              <span className="font-semibold text-xforge-gold">
                Reserve now{" "}
              </span>
              <span className="text-white">and save about </span>
              <span className="font-semibold text-xforge-green-bright">
                $200
              </span>
            </p>
          </motion.div>
        </div>

        {/* Footer links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col gap-4 lg:gap-6 w-full"
        >
          <div className="flex items-center justify-center gap-5 lg:gap-6 text-base lg:text-xl leading-[1.1] text-white">
            <a
              href="https://kickstarter.xforgephone.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal hover:text-xforge-gold transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="https://kickstarter.xforgephone.com/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-xforge-gold transition-colors duration-200"
            >
              Refund Policy
            </a>
            <a
              href="mailto:support@xforgephone.com"
              className="font-normal hover:text-xforge-gold transition-colors duration-200"
            >
              Contact
            </a>
          </div>
          <p className="text-[11px] lg:text-sm font-normal leading-[1.1] text-xforge-gold text-center">
            © 2026 XForge. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
