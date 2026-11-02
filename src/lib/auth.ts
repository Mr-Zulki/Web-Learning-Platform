import "server-only";
import NextAuth, { type DefaultSession, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";
import { loginSchema } from "./auth-schema";
import { rateLimit, getClientIp } from "./rate-limit";
import { getLoginLimitConfig } from "./rate-limit-config";
import { logger } from "./logger";
import { verifyPassword, verifyDummyPassword, hashPassword } from "./password";

declare module "next-auth" {
  interface User {
    id?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Rate limiting: 10 attempts per 15 min per IP and per email
        try {
          const reqHeaders = await headers();
          const ip = getClientIp(reqHeaders);
          const loginRules = getLoginLimitConfig();

          const [ipLimit, emailLimit] = await Promise.all([
            rateLimit({
              key: `rate:login:ip:${ip}`,
              limit: loginRules.ip.limit,
              windowSeconds: loginRules.ip.windowSeconds,
            }),
            rateLimit({
              key: `rate:login:email:${email}`,
              limit: loginRules.email.limit,
              windowSeconds: loginRules.email.windowSeconds,
            }),
          ]);

          if (!ipLimit.allowed || !emailLimit.allowed) {
            logger.warn("Login attempt blocked by rate limit", {
              email,
              ip,
            });
            throw new Error("RATE_LIMITED");
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.message === "RATE_LIMITED") {
            throw err;
          }
          // headers() may not be available in synthetic test runners
        }

        // Wrap DB lookup and password verification so errors are logged
        // instead of silently becoming "Invalid email or password" via NextAuth.
        try {
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            logger.info("login_user_not_found", { email });
            // Constant-time execution against dummy hash off the event loop
            await verifyDummyPassword(password);
            return null;
          }

          const { valid, needsUpgrade } = await verifyPassword(
            password,
            user.passwordHash
          );
          if (!valid) {
            logger.info("login_password_mismatch", { email });
            return null;
          }

          if (needsUpgrade) {
            try {
              const upgradedHash = await hashPassword(password);
              await db.user.update({
                where: { id: user.id },
                data: { passwordHash: upgradedHash },
              });
              logger.info(
                "Transparently upgraded user password hash to scrypt",
                { userId: user.id }
              );
            } catch (upgradeErr) {
              logger.warn("Failed to upgrade legacy password hash", {
                error: String(upgradeErr),
              });
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (err: unknown) {
          // Log the error so DB/connection failures are visible in production
          // logs instead of silently returning null ("Invalid email or password").
          const errObj = err as { name?: string; code?: string; message?: string };
          const safeMessage = (errObj?.message ?? String(err)).replace(
            /\/\/[^@]+@/g,
            "//[REDACTED]@"
          );
          logger.error("login_authorize_error", {
            event: "login_authorize_error",
            errorName: errObj?.name ?? "UnknownError",
            errorCode: errObj?.code ?? "NONE",
            message: safeMessage,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
  trustHost: true,
});

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export type RequireUserResult =
  | { user: AuthenticatedUser; errorResponse: null }
  | { user: null; errorResponse: NextResponse };

export const authService = {
  auth: auth as () => Promise<Session | null>,
};

export async function requireUser(): Promise<RequireUserResult> {
  const session = await authService.auth();
  if (!session?.user?.id) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required.",
          },
        },
        { status: 401 }
      ),
    };
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
    },
    errorResponse: null,
  };
}
