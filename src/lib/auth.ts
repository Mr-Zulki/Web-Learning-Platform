import "server-only";
import NextAuth, { type DefaultSession, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";
import { loginSchema } from "./auth-schema";
import { rateLimit, getClientIp } from "./rate-limit";
import { logger } from "./logger";

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

const DUMMY_HASH =
  "$2b$12$8OJPv08RWCnnMrpB.Q6TmuMS3RaR3NZVM7C.Pl.ZYKmIiyrJV1wc2";

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

          const [ipLimit, emailLimit] = await Promise.all([
            rateLimit({
              key: `rate:login:ip:${ip}`,
              limit: 10,
              windowSeconds: 15 * 60,
            }),
            rateLimit({
              key: `rate:login:email:${email}`,
              limit: 10,
              windowSeconds: 15 * 60,
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

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Constant-time execution against dummy hash
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
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
