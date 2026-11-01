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
    <div className="glass-panel-elevated relative rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
      <div className="mb-8 space-y-2 text-center">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/20 text-blue-400 shadow-inner">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-400">
          Log in to resume your lessons and challenges.
        </p>
      </div>

      {registeredParam && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 sm:text-sm"
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
          className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 sm:text-sm"
        >
          <span aria-hidden="true">⚠</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-300 uppercase"
          >
            Email Address
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3.5 text-slate-500">
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
              className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-500 focus-visible:ring-2 focus-visible:outline-none ${
                fieldErrors.email
                  ? "border-red-500/70 focus-visible:ring-red-500/40"
                  : "border-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/40"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p
              id="email-error"
              className="mt-1.5 text-xs font-medium text-red-400"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-300 uppercase"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3.5 text-slate-500">
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
              className={`w-full rounded-xl border bg-slate-900/80 py-2.5 pr-11 pl-10 text-sm text-white transition-all placeholder:text-slate-500 focus-visible:ring-2 focus-visible:outline-none ${
                fieldErrors.password
                  ? "border-red-500/70 focus-visible:ring-red-500/40"
                  : "border-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle visibility"
              className="absolute right-3 rounded p-1 text-slate-400 transition-colors hover:text-slate-200"
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
              className="mt-1.5 text-xs font-medium text-red-400"
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
          className="mt-2 w-full font-semibold shadow-xl shadow-blue-500/25"
        >
          {isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-8 border-t border-white/5 pt-4 text-center text-xs text-slate-400 sm:text-sm">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-400 underline transition hover:text-blue-300"
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
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[100px]"
        aria-hidden="true"
      />
      <Suspense
        fallback={
          <div className="glass-panel-elevated h-80 animate-pulse rounded-3xl border border-white/10 p-8" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
