import { NextResponse } from "next/server";
import os from "node:os";

const startTime = Date.now();

export async function GET() {
  const instance = os.hostname();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const response = NextResponse.json({
    status: "ok",
    instance,
    uptimeSeconds,
  });
  response.headers.set("X-Served-By", instance);
  return response;
}
