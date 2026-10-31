import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          HTML/CSS Interactive Learning Platform
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Master HTML and CSS fundamentals through hands-on lessons, live code
          previews, and automated challenges.
        </p>
        <div>
          <Link
            href="/lessons"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-xs transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Start learning →
          </Link>
        </div>
      </div>
    </main>
  );
}
