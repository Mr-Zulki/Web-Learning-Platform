"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { registerSchema } from "@/lib/auth-schema";

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

      // Auto login after successful registration
      const loginRes = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (!loginRes || loginRes.error) {
        router.push("/login?registered=1");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setSubmitError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  const passwordChecks = [
    { label: "Minimum 8 characters", valid: password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(password) },
  ];

  return (
    <main className="w-full flex-1 flex items-center justify-center p-space-md py-space-xl bg-surface-container-low">
      <div className="rounded-2xl bg-surface-container-lowest p-space-xl shadow-lg border border-surface-variant/50 max-w-md w-full mx-auto">
        <div className="mb-space-lg space-y-1 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-sm mx-auto mb-space-md">
            <span className="material-symbols-outlined text-[24px]">person_add</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
            Create an Account
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Start learning HTML and CSS interactively with auto-graded challenges.
          </p>
        </div>

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
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block font-title-md text-body-sm font-semibold text-on-surface mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-10 pr-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
              />
            </div>
            {fieldErrors.name && (
              <p id="name-error" className="mt-1 text-xs text-error font-medium">
                {fieldErrors.name}
              </p>
            )}
          </div>

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
              <p
                id="email-error"
                className="mt-1 text-xs text-error font-medium"
              >
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
                autoComplete="new-password"
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

            {/* Password Requirements Guidance */}
            <div className="mt-2 space-y-1">
              {passwordChecks.map((check, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs ${
                    check.valid ? "text-emerald-700 font-semibold" : "text-outline"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {check.valid ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-title-md text-body-sm shadow-sm transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-space-lg text-center font-body-sm text-body-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline hover:text-secondary"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
