import Link from "next/link";

export default function LessonNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Lesson Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          The requested lesson could not be found. Please check the URL or
          select a valid lesson from the curriculum.
        </p>
        <div className="pt-2">
          <Link
            href="/lessons"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            ← Back to Lessons
          </Link>
        </div>
      </div>
    </main>
  );
}
