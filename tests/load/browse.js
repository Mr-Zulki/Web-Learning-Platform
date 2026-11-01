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
    { duration: "10s", target: 50 },
    { duration: "20s", target: 200 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"],
    http_req_failed: ["rate<0.05"],
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:8080";

function trackStatus(res) {
  if (res.status >= 200 && res.status < 300) status_2xx.add(1);
  else if (res.status === 429) status_429.add(1);
  else if (res.status === 502) status_502.add(1);
  else if (res.status === 503) status_503.add(1);
  else if (res.status === 504) status_504.add(1);
  else if (res.status >= 500) status_5xx.add(1);
}

export default function runBrowseScenario() {
  // 1. Home page
  const homeRes = http.get(`${BASE_URL}/`);
  trackStatus(homeRes);
  check(homeRes, { "home 200": (r) => r.status === 200 });

  // 2. Lessons index
  const lessonsRes = http.get(`${BASE_URL}/lessons`);
  trackStatus(lessonsRes);
  check(lessonsRes, { "lessons 200": (r) => r.status === 200 });

  // 3. Lesson detail
  const detailRes = http.get(`${BASE_URL}/lessons/html-structure`);
  trackStatus(detailRes);
  check(detailRes, { "detail 200": (r) => r.status === 200 });

  sleep(0.2);
}
