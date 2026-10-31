import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "15s", target: 50 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% of requests must complete below 800ms
    http_req_failed: ["rate<0.01"], // Error rate must be less than 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:8080";

export default function runSmokeTest() {
  // 1. Home page
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    "home status is 200": (r) => r.status === 200,
  });

  // 2. Lessons index
  const lessonsRes = http.get(`${BASE_URL}/lessons`);
  check(lessonsRes, {
    "lessons status is 200": (r) => r.status === 200,
  });

  // 3. Lesson detail page
  const lessonDetailRes = http.get(`${BASE_URL}/lessons/html-structure`);
  check(lessonDetailRes, {
    "lesson detail status is 200": (r) => r.status === 200,
  });

  // 4. Liveness API endpoint
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    "health status is 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
