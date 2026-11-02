import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center bg-surface">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-surface-container-lowest p-8 shadow-card border border-outline-variant/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline-xl font-bold tracking-tight text-on-surface text-2xl">
            Page Not Found
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
            We could not find the page you were looking for. It may have moved or
            the link is broken.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="w-full justify-center font-label-pill shadow-button"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
