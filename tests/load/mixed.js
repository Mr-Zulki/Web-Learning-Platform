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
    { duration: "10s", target: 30 },
    { duration: "20s", target: 80 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2500"],
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

const vuSessions = {};

export default function runMixedScenario() {
  const rand = Math.random();

  if (rand < 0.7) {
    // 70% Browse
    const target =
      rand < 0.25
        ? `${BASE_URL}/`
        : rand < 0.5
          ? `${BASE_URL}/lessons`
          : `${BASE_URL}/lessons/html-structure`;

    const res = http.get(target);
    trackStatus(res);
    check(res, { "browse 200": (r) => r.status === 200 });
  } else if (rand < 0.9) {
    // 20% Auth / Login flow
    const unique = `${__VU}_${__ITER}_${Date.now()}`;
    const email = `mix_${unique}@example.com`;
    const password = "Password123!";

    const regRes = http.post(
      `${BASE_URL}/api/auth/register`,
      JSON.stringify({ name: `Mix User ${unique}`, email, password }),
      { headers: { "Content-Type": "application/json" } }
    );
    trackStatus(regRes);

    const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`);
    trackStatus(csrfRes);

    let csrfToken = "";
    try {
      csrfToken = csrfRes.json().csrfToken;
    } catch {
      // ignore
    }

    if (csrfToken && regRes.status === 201) {
      const loginRes = http.post(
        `${BASE_URL}/api/auth/callback/credentials`,
        { csrfToken, email, password },
        { redirects: 0 }
      );
      trackStatus(loginRes);

      const jar = http.cookieJar();
      const cookies = jar.cookiesForURL(BASE_URL);
      let cookieStr = "";
      for (const name in cookies) {
        cookieStr += `${name}=${cookies[name][0]}; `;
      }
      vuSessions[__VU] = cookieStr;
    }
  } else {
    // 10% Progress Write
    const cookieHeader = vuSessions[__VU] || "";
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
      "progress write finished": (r) => r.status > 0,
    });
  }

  sleep(0.2);
}
