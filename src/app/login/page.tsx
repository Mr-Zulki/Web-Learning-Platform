"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
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
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Log in to resume your lessons and challenges.
        </p>
      </div>

      {registeredParam && (
        <div
          role="status"
          className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          Registration successful! Please log in with your credentials.
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-slate-900 dark:text-slate-200"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          {fieldErrors.email && (
            <p
              id="email-error"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-slate-900 dark:text-slate-200"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            aria-invalid={Boolean(fieldErrors.password)}
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          {fieldErrors.password && (
            <p
              id="password-error"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Log In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 transition hover:underline dark:text-blue-400"
        >
          Sign up here
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
