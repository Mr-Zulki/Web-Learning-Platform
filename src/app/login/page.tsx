"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginSchema } from "@/lib/auth-schema";
import { getSafeRedirect } from "@/lib/redirect";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const registeredParam = searchParams.get("registered");
  const targetRedirect = getSafeRedirect(nextParam, "/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as "email" | "password";
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (!res || res.error) {
        if (res?.error?.includes("RATE_LIMITED") || res?.status === 429) {
          setSubmitError(
            "Too many login attempts. Please wait 15 minutes before trying again."
          );
        } else {
          setSubmitError("Invalid email or password.");
        }
        setIsSubmitting(false);
        return;
      }

      router.push(targetRedirect);
      router.refresh();
    } catch {
      setSubmitError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-panel-elevated metallic-top-edge relative rounded-3xl p-8 shadow-2xl sm:p-10">
      <div className="mb-8 space-y-2 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3D52A0]/20 text-[#7091E6] shadow-inner">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-black tracking-tight text-[var(--canvas-text)] sm:text-3xl">
          Welcome Back
        </h1>
        <p className="text-sm text-[var(--canvas-text-secondary)]">
          Log in to resume your lessons and challenges.
        </p>
      </div>

      {registeredParam && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 sm:text-sm dark:text-emerald-300"
        >
          <span aria-hidden="true">✓</span>
          <span>
            Registration successful! Please log in with your credentials.
          </span>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 sm:text-sm dark:text-red-300"
        >
          <span aria-hidden="true">⚠</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--canvas-text-secondary)] uppercase"
          >
            Email Address
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3.5 text-[var(--canvas-text-muted)]">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              aria-invalid={Boolean(fieldErrors.email)}
              placeholder="you@example.com"
              className={`w-full rounded-xl border bg-white/15 py-2.5 pr-4 pl-10 text-sm text-[var(--canvas-text)] backdrop-blur-md transition-all placeholder:text-[var(--canvas-text-muted)] focus-visible:ring-2 focus-visible:outline-none dark:bg-black/30 ${
                fieldErrors.email
                  ? "border-red-500/70 focus-visible:ring-red-500/40"
                  : "border-[var(--border-glass)] hover:border-[var(--border-glass-strong)] focus-visible:border-[#7091E6] focus-visible:ring-[#7091E6]/40"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p
              id="email-error"
              className="mt-1.5 text-xs font-semibold text-red-500 dark:text-red-400"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--canvas-text-secondary)] uppercase"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3.5 text-[var(--canvas-text-muted)]">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              aria-invalid={Boolean(fieldErrors.password)}
              placeholder="••••••••"
              className={`w-full rounded-xl border bg-white/15 py-2.5 pr-11 pl-10 text-sm text-[var(--canvas-text)] backdrop-blur-md transition-all placeholder:text-[var(--canvas-text-muted)] focus-visible:ring-2 focus-visible:outline-none dark:bg-black/30 ${
                fieldErrors.password
                  ? "border-red-500/70 focus-visible:ring-red-500/40"
                  : "border-[var(--border-glass)] hover:border-[var(--border-glass-strong)] focus-visible:border-[#7091E6] focus-visible:ring-[#7091E6]/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle visibility"
              className="absolute right-3 rounded-lg p-1 text-[var(--canvas-text-secondary)] transition-colors hover:text-[var(--canvas-text)]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p
              id="password-error"
              className="mt-1.5 text-xs font-semibold text-red-500 dark:text-red-400"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          variant="primary"
          size="lg"
          className="mt-2 w-full font-bold shadow-xl shadow-[#3D52A0]/25"
        >
          {isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-[var(--canvas-text-secondary)] sm:text-sm">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-bold text-[#7091E6] underline transition hover:text-[#ADBBDA]"
        >
          Sign up here
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--orb-1)] blur-[100px]"
        aria-hidden="true"
      />
      <Suspense
        fallback={
          <div className="glass-panel-elevated h-80 animate-pulse rounded-3xl p-8" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
