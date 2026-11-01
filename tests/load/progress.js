import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

export const status_2xx = new Counter("status_2xx");
export const status_429 = new Counter("status_429");
export const status_5xx = new Counter("status_5xx");
export const status_502 = new Counter("status_502");
export const status_503 = new Counter("status_503");
export const status_504 = new Counter("status_504");

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "15s", target: 30 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:8080";

const SOLUTION = {
  lessonId: "html-structure",
  challengeId: "challenge-html-structure",
  status: "COMPLETED",
  submission: {
    html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n  <p>Hello world</p>\n</body>\n</html>',
    css: "",
  },
};

function trackStatus(res) {
  if (res.status >= 200 && res.status < 400) status_2xx.add(1);
  else if (res.status === 429) status_429.add(1);
  else if (res.status === 502) status_502.add(1);
  else if (res.status === 503) status_503.add(1);
  else if (res.status === 504) status_504.add(1);
  else if (res.status >= 500) status_5xx.add(1);
}

// Map of VU to authenticated cookie header
const vuSessions = {};

export default function runProgressScenario() {
  const vuId = __VU;

  // 1. Authenticate once per VU
  if (!vuSessions[vuId]) {
    const email = `prog_vu${vuId}_${Date.now()}@example.com`;
    const password = "Password123!";

    // Register
    http.post(
      `${BASE_URL}/api/auth/register`,
      JSON.stringify({ name: `VU ${vuId}`, email, password }),
      { headers: { "Content-Type": "application/json" } }
    );

    // Fetch CSRF
    const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`);
    let csrfToken = "";
    try {
      csrfToken = csrfRes.json().csrfToken;
    } catch {
      // ignore
    }

    // Login
    if (csrfToken) {
      http.post(
        `${BASE_URL}/api/auth/callback/credentials`,
        {
          csrfToken,
          email,
          password,
        },
        { redirects: 0 }
      );

      // Extract cookies
      const jar = http.cookieJar();
      const cookies = jar.cookiesForURL(BASE_URL);
      let cookieStr = "";
      for (const name in cookies) {
        cookieStr += `${name}=${cookies[name][0]}; `;
      }
      vuSessions[vuId] = cookieStr;
    }
  }

  // 2. Post progress repeatedly
  const cookieHeader = vuSessions[vuId] || "";
  const progRes = http.post(
    `${BASE_URL}/api/progress`,
    JSON.stringify(SOLUTION),
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    }
  );
  trackStatus(progRes);
  check(progRes, {
    "progress write ok or rate limited": (r) =>
      r.status === 200 || r.status === 429 || r.status === 401,
  });

  sleep(0.3);
}
