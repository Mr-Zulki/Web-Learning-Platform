# API

| Method | Route              | Auth | Body                            | Response      |
| ------ | ------------------ | ---- | ------------------------------- | ------------- |
| POST   | /api/auth/register | no   | {email, password, name}         | 201 user      |
| POST   | /api/auth/login    | no   | {email, password}               | 200 session   |
| GET    | /api/lessons       | no   | —                               | lesson list   |
| GET    | /api/lessons/[id]  | no   | —                               | lesson detail |
| POST   | /api/progress      | yes  | {lessonId, challengeId, status} | 200           |
| GET    | /api/progress      | yes  | —                               | user progress |
| GET    | /health            | no   | —                               | {status:"ok"} |
