"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LessonsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lessons route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="glass-panel-elevated metallic-top-edge max-w-md space-y-4 rounded-2xl border border-[var(--border-glass)] p-8">
        <h1 className="font-heading text-3xl font-extrabold text-red-600 dark:text-red-400">
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
          An error occurred while loading lesson content. Please try again or
          return to the home page.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-[#3D52A0] px-5 py-2.5 text-sm font-semibold text-[#EDE8F5] shadow-lg shadow-[#3D52A0]/25 transition hover:bg-[#7091E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D52A0]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="glass-panel rounded-xl border border-[var(--border-glass)] px-5 py-2.5 text-sm font-semibold text-[var(--canvas-text)] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D52A0]"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
