import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LessonNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-surface">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-surface-container-lowest p-8 shadow-card border border-outline-variant/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <BookOpen className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline-xl font-bold tracking-tight text-on-surface text-2xl">
            Lesson Not Found
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
            The requested lesson could not be found. Please check the URL or
            select a valid lesson from the curriculum.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/lessons">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="w-full justify-center font-label-pill shadow-button"
            >
              Back to Lessons
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
