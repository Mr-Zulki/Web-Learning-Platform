import { NextResponse } from "next/server";
import os from "node:os";

export function proxy() {
  const response = NextResponse.next();
  response.headers.set("X-Served-By", os.hostname());
  return response;
}
