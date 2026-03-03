import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

function readSubscribers(): { email: string; subscribedAt: string }[] {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSubscribers(
  subscribers: { email: string; subscribedAt: string }[]
) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(subscribers, null, 2));
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
    const body = await res.json();
    if (body.title === "Member Exists") return { exists: true };
    throw new Error(body.detail || "Mailchimp error");
  }

  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Save to local DB
    const subscribers = readSubscribers();
    const alreadyExists = subscribers.some(
      (s) => s.email === normalizedEmail
    );

    if (!alreadyExists) {
      subscribers.push({
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
      });
      writeSubscribers(subscribers);
    }

    // Save to Mailchimp (non-blocking -- don't fail the request if Mailchimp is down)
    let mailchimpResult: Record<string, unknown> = {};
    try {
      mailchimpResult = await addToMailchimp(normalizedEmail);
    } catch (err) {
      console.error("Mailchimp error:", err);
      mailchimpResult = { error: String(err) };
    }

    return NextResponse.json({
      success: true,
      isNew: !alreadyExists,
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
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message:
      "POST an email to subscribe. GET /api/subscribe?key=YOUR_ADMIN_KEY to list all.",
  });
}
