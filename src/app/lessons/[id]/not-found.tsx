import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LessonNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="glass-panel-elevated metallic-top-edge w-full max-w-md space-y-5 rounded-3xl p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow-inner dark:text-amber-400">
          <BookOpen className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-2xl font-black tracking-tight text-[var(--canvas-text)] sm:text-3xl">
          Lesson Not Found
        </h1>
        <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
          The requested lesson could not be found. Please check the URL or
          select a valid lesson from the curriculum.
        </p>
        <div className="pt-2">
          <Link href="/lessons">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="font-bold shadow-lg"
            >
              Back to Lessons
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
