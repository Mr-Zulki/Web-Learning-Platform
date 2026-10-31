import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .transform((val) => val.trim().toLowerCase())
      .pipe(
        z
          .string()
          .email("Please provide a valid email address.")
          .max(254, "Email must not exceed 254 characters.")
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must not exceed 72 bytes.")
      .refine((val) => Buffer.byteLength(val, "utf8") <= 72, {
        message: "Password must not exceed 72 bytes.",
      }),
    name: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .min(1, "Name is required.")
          .max(60, "Name must not exceed 60 characters.")
      ),
  })
  .refine((data) => data.password.toLowerCase() !== data.email.toLowerCase(), {
    message: "Password cannot be the same as your email address.",
    path: ["password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .pipe(z.string().email("Please provide a valid email address.")),
  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;
