import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as readyGet } from "@/app/api/ready/route";
import { db } from "@/lib/db";

describe("Health and Readiness API Routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/health returns 200 with status ok, instance, and uptimeSeconds", async () => {
    const res = await healthGet();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(typeof data.instance).toBe("string");
    expect(typeof data.uptimeSeconds).toBe("number");
    expect(res.headers.get("X-Served-By")).toBe(data.instance);
  });

  it("GET /api/ready returns 200 when database query succeeds", async () => {
    vi.spyOn(db, "$queryRawUnsafe").mockResolvedValueOnce([{ "?column?": 1 }]);

    const res = await readyGet();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("ready");
    expect(res.headers.get("X-Served-By")).toBeTruthy();
  });

  it("GET /api/ready returns 503 when database query fails", async () => {
    vi.spyOn(db, "$queryRawUnsafe").mockRejectedValueOnce(
      new Error("DB connection timeout")
    );

    const res = await readyGet();
    expect(res.status).toBe(503);

    const data = await res.json();
    expect(data.status).toBe("not_ready");
    expect(res.headers.get("X-Served-By")).toBeTruthy();
  });
});
