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
    { duration: "2s", target: 300 },
    { duration: "30s", target: 300 },
    { duration: "3s", target: 0 },
  ],
  thresholds: {
    // Under extreme 300 VU spike on a laptop, track metrics without hard-failing script
    http_req_failed: ["rate<0.50"],
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

export default function runSpikeScenario() {
  const pages = ["/", "/lessons", "/lessons/html-structure", "/api/health"];
  const page = pages[Math.floor(Math.random() * pages.length)];

  const res = http.get(`${BASE_URL}${page}`);
  trackStatus(res);
  check(res, {
    "response received": (r) => r.status > 0,
  });

  sleep(0.1);
}
