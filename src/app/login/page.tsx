"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginSchema } from "@/lib/auth-schema";
import { getSafeRedirect } from "@/lib/redirect";

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
    <div className="rounded-2xl bg-surface-container-lowest p-space-xl shadow-lg border border-surface-variant/50 max-w-md w-full mx-auto">
      <div className="mb-space-lg space-y-1 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-sm mx-auto mb-space-md">
          <span className="material-symbols-outlined text-[24px]">terminal</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
          Welcome Back
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Log in to resume your lessons and challenges.
        </p>
      </div>

      {registeredParam && (
        <div
          role="status"
          className="mb-space-md flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 p-3 text-body-sm font-medium text-emerald-800"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Registration successful! Please log in with your credentials.</span>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-space-md flex items-center gap-2 rounded-lg border border-error/30 bg-error-container/20 p-3 text-body-sm font-medium text-error"
        >
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-space-md">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block font-title-md text-body-sm font-semibold text-on-surface mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-10 pr-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" className="mt-1 text-xs text-error font-medium">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block font-title-md text-body-sm font-semibold text-on-surface mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-10 pr-10 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle visibility"
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-outline hover:text-on-surface focus:outline-none"
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
              className="mt-1 text-xs text-error font-medium"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-title-md text-body-sm shadow-sm transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-space-lg text-center font-body-sm text-body-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline hover:text-secondary"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="w-full flex-1 flex items-center justify-center p-space-md py-space-xl bg-surface-container-low">
      <Suspense
        fallback={
          <div className="h-80 w-full max-w-md animate-pulse rounded-2xl bg-surface-container-high" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
