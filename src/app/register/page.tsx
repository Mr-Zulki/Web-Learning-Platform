"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { UserPlus, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { registerSchema } from "@/lib/auth-schema";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const errors: { name?: string; email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as "name" | "email" | "password";
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(
          data?.error?.message || "Registration failed. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Automatically sign in upon successful registration
      try {
        const loginRes = await signIn("credentials", {
          email: parsed.data.email,
          password: parsed.data.password,
          redirect: false,
        });

        if (loginRes?.error) {
          router.push("/login?registered=1");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } catch {
        router.push("/login?registered=1");
      }
    } catch {
      setSubmitError("Network error. Please check your connection.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--orb-1)] blur-[100px]"
        aria-hidden="true"
      />

      <div className="glass-panel-elevated metallic-top-edge relative rounded-3xl p-8 shadow-2xl sm:p-10">
        <div className="mb-8 space-y-2 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3D52A0]/20 text-[#7091E6] shadow-inner">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-[var(--canvas-text)] sm:text-3xl">
            Create an Account
          </h1>
          <p className="text-sm text-[var(--canvas-text-secondary)]">
            Sign up to track your learning progress and save solutions.
          </p>
        </div>

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
              htmlFor="register-name"
              className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--canvas-text-secondary)] uppercase"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3.5 text-[var(--canvas-text-muted)]">
                <User className="h-4 w-4" />
              </span>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                aria-invalid={Boolean(fieldErrors.name)}
                placeholder="Alex Dev"
                className={`w-full rounded-xl border bg-white/15 py-2.5 pr-4 pl-10 text-sm text-[var(--canvas-text)] backdrop-blur-md transition-all placeholder:text-[var(--canvas-text-muted)] focus-visible:ring-2 focus-visible:outline-none dark:bg-black/30 ${
                  fieldErrors.name
                    ? "border-red-500/70 focus-visible:ring-red-500/40"
                    : "border-[var(--border-glass)] hover:border-[var(--border-glass-strong)] focus-visible:border-[#7091E6] focus-visible:ring-[#7091E6]/40"
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p
                id="name-error"
                className="mt-1.5 text-xs font-semibold text-red-500 dark:text-red-400"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--canvas-text-secondary)] uppercase"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3.5 text-[var(--canvas-text-muted)]">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="register-email"
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
              htmlFor="register-password"
              className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--canvas-text-secondary)] uppercase"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3.5 text-[var(--canvas-text-muted)]">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-[var(--canvas-text-secondary)] sm:text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#7091E6] underline transition hover:text-[#ADBBDA]"
          >
            Log in here
          </Link>
        </div>
      </div>
    </main>
  );
}
