import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: "Terms and Conditions for XForge Phone.",
    alternates: {
        canonical: `${SITE_URL}/terms-and-conditions`,
    },
};

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-xforge-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-xforge-gray hover:text-white transition-colors duration-200 mb-10"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 12L6 8L10 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
                    Terms &amp; Conditions
                </h1>

                <div className="text-[15px] leading-relaxed text-[#ccc]">
                    <p>This page will be updated with our full Terms &amp; Conditions soon.</p>
                    <p className="mt-4">
                        For any questions, please contact us at{" "}
                        <a
                            href="mailto:support@xforgephone.com"
                            className="text-xforge-gold hover:underline"
                        >
                            support@xforgephone.com
                        </a>
                        .
                    </p>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 text-center text-xforge-gray text-xs">
                    © 2026 XForge. All rights reserved.
                </div>
            </div>
        </main>
    );
}
