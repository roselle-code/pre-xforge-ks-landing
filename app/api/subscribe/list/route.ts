import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  const providedKey = req.nextUrl.searchParams.get("key");

  if (!adminKey || providedKey !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const subscribers = JSON.parse(raw);
    return NextResponse.json({
      total: subscribers.length,
      subscribers,
    });
  } catch {
    return NextResponse.json({ total: 0, subscribers: [] });
  }
}
