import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import os from "node:os";

export async function GET() {
  const instance = os.hostname();
  try {
    // Run SELECT 1 with a 2-second timeout using Promise.race
    await Promise.race([
      db.$queryRawUnsafe("SELECT 1"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      ),
    ]);

    const response = NextResponse.json({ status: "ready" }, { status: 200 });
    response.headers.set("X-Served-By", instance);
    return response;
  } catch {
    const response = NextResponse.json(
      { status: "not_ready" },
      { status: 503 }
    );
    response.headers.set("X-Served-By", instance);
    return response;
  }
}
