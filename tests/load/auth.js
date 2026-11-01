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
    { duration: "5s", target: 20 },
    { duration: "15s", target: 50 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"],
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:8080";

function trackStatus(res) {
  if (res.status >= 200 && res.status < 400) status_2xx.add(1);
  else if (res.status === 429) status_429.add(1);
  else if (res.status === 502) status_502.add(1);
  else if (res.status === 503) status_503.add(1);
  else if (res.status === 504) status_504.add(1);
  else if (res.status >= 500) status_5xx.add(1);
}

export default function runAuthScenario() {
  const uniqueId = `${__VU}_${__ITER}_${Date.now()}`;
  const user = {
    name: `Load User ${uniqueId}`,
    email: `load_${uniqueId}@example.com`,
    password: "Password123!",
  };

  // 1. Register
  const regRes = http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify(user),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  trackStatus(regRes);
  check(regRes, {
    "register ok or expected rate limit": (r) =>
      r.status === 201 || r.status === 429,
  });

  // 2. Fetch CSRF token
  const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`);
  trackStatus(csrfRes);
  let csrfToken = "";
  try {
    const json = csrfRes.json();
    csrfToken = json.csrfToken;
  } catch {
    // ignore
  }

  // 3. Login callback
  if (csrfToken && regRes.status === 201) {
    const loginRes = http.post(
      `${BASE_URL}/api/auth/callback/credentials`,
      {
        csrfToken: csrfToken,
        email: user.email,
        password: user.password,
      },
      {
        redirects: 0,
      }
    );
    trackStatus(loginRes);
    check(loginRes, {
      "login redirected or ok": (r) =>
        r.status === 302 || r.status === 200 || r.status === 429,
    });
  }

  sleep(0.5);
}
