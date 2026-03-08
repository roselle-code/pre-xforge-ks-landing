// Admin-only endpoint to list subscribers from KV.
// Protected by Bearer token.
// Requires: ADMIN_API_KEY in env
// Usage: curl -H "Authorization: Bearer <key>" /api/subscribe/list

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token || token !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext();
    const kv = (env as Record<string, unknown>).SUBSCRIBERS_KV as KVNamespace | undefined;

    if (!kv) {
      return NextResponse.json({
        total: 0,
        subscribers: [],
        note: "SUBSCRIBERS_KV binding not configured",
      });
    }

    // List all keys and fetch their values
    const keys = await kv.list();
    const subscribers = await Promise.all(
      keys.keys.map(async (key: { name: string }) => {
        const value = await kv.get(key.name);
        return value ? JSON.parse(value) : null;
      })
    );

    const validSubscribers = subscribers.filter(Boolean);

    return NextResponse.json({
      total: validSubscribers.length,
      subscribers: validSubscribers,
    });
  } catch {
    return NextResponse.json({ total: 0, subscribers: [] });
  }
}
