import random
from locust import HttpUser, task, between

class PlatformLearnerUser(HttpUser):
    wait_time = between(0.2, 1.0)

    def on_start(self):
        # Pick a seeded user from the 200 pool
        self.user_id = random.randint(1, 200)
        self.email = f"loaduser_{self.user_id}@example.com"
        self.password = "Password123!"
        self.csrf_token = ""
        self.authenticate()

    def authenticate(self):
        # 1. Fetch CSRF token
        with self.client.get("/api/auth/csrf", catch_response=True) as res:
            if res.status_code == 200:
                data = res.json()
                self.csrf_token = data.get("csrfToken", "")
            else:
                res.failure(f"Failed to fetch CSRF token: {res.status_code}")

        # 2. Login via credentials callback
        if self.csrf_token:
            payload = {
                "csrfToken": self.csrf_token,
                "email": self.email,
                "password": self.password,
            }
            self.client.post("/api/auth/callback/credentials", data=payload, allow_redirects=False)

    @task(4)
    def browse_home(self):
        self.client.get("/")

    @task(3)
    def browse_lessons(self):
        self.client.get("/lessons")

    @task(3)
    def browse_lesson_detail(self):
        self.client.get("/lessons/html-structure")

    @task(2)
    def check_health(self):
        self.client.get("/api/health")

    @task(1)
    def submit_progress(self):
        payload = {
            "lessonId": "html-structure",
            "challengeId": "challenge-html-structure",
            "status": "COMPLETED",
            "submission": {
                "html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head><title>Test</title></head>\n<body><h1>Title</h1></body>\n</html>",
                "css": ""
            }
        }
        self.client.post("/api/progress", json=payload)

