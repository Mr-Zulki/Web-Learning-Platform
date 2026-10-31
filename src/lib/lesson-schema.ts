import { z } from "zod";

export const lessonSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be in kebab-case format"),
  title: z.string().min(1, "title is required"),
  order: z.number().int().positive("order must be a positive integer"),
  summary: z.string().min(1, "summary is required"),
  body: z.string().min(1, "body is required"),
  starterCode: z.object({
    html: z.string(),
    css: z.string(),
  }),
  challengeId: z.string().min(1, "challengeId is required"),
});

export type Lesson = z.infer<typeof lessonSchema>;
