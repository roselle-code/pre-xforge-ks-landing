// Email subscription API. Syncs to Mailchimp (persistent store) and backs up
// to Cloudflare KV when the SUBSCRIBERS_KV binding is available.
// Requires: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID in env / .dev.vars
// Called by: Hero.tsx, EmailSubscription.tsx (MosaicGallery), Footer.tsx
// Rate limited by Cloudflare WAF rules (in-memory rate limiting doesn't work
// on Workers — each invocation is isolated and geographically distributed).

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface Subscriber {
  email: string;
  subscribedAt: string;
  source?: string;
  userAgent?: string;
}

async function getKV(): Promise<KVNamespace | null> {
  try {
    const { env } = await getCloudflareContext();
    return (env as Record<string, unknown>).SUBSCRIBERS_KV as KVNamespace ?? null;
  } catch {
    return null;
  }
}

async function addToMailchimp(email: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) return { skipped: true };

  const dc = apiKey.split("-").pop();
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `apikey ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      tags: ["xforge-landing"],
    }),
  });

  if (!res.ok) {
    const body = (await res.json()) as { title?: string; detail?: string };
    if (body.title === "Member Exists") return { exists: true };
    throw new Error(body.detail || "Mailchimp error");
  }

  return { success: true };
}

const VALID_SOURCES = ["hero", "how_it_works", "footer", "unknown"] as const;

function sanitizeSource(raw: unknown): string {
  if (typeof raw !== "string") return "unknown";
  const trimmed = raw.trim().toLowerCase().slice(0, 30);
  return (VALID_SOURCES as readonly string[]).includes(trimmed)
    ? trimmed
    : "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const { email, source } = (await req.json()) as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userAgent = req.headers.get("user-agent") || undefined;
    const validatedSource = sanitizeSource(source);

    // Back up to KV if the binding is available
    let isNew = true;
    const kv = await getKV();
    if (kv) {
      const existing = await kv.get(normalizedEmail);
      isNew = !existing;
      if (isNew) {
        const subscriber: Subscriber = {
          email: normalizedEmail,
          subscribedAt: new Date().toISOString(),
          source: validatedSource,
          userAgent,
        };
        await kv.put(normalizedEmail, JSON.stringify(subscriber));
      }
    }

    // Mailchimp is the primary persistent store
    let mailchimpResult: Record<string, unknown> = {};
    try {
      mailchimpResult = await addToMailchimp(normalizedEmail);
      if (mailchimpResult.exists) isNew = false;
    } catch {
      mailchimpResult = { error: "mailchimp_unavailable" };
    }

    return NextResponse.json({
      success: true,
      isNew,
      mailchimp: mailchimpResult,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "POST an email to subscribe. GET /api/subscribe/list with Authorization: Bearer <key> to list all.",
  });
}
