# Data Model (Prisma)

User

- id, email (unique), passwordHash, name, createdAt

Progress

- id, userId → User, lessonId (string), challengeId (string, nullable)
- status: "started" | "completed"
- updatedAt
- unique(userId, lessonId, challengeId)

Lessons & challenges are JSON files in src/content/ (not DB).
