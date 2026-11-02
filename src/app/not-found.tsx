import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      <div className="glass-panel-elevated metallic-top-edge w-full max-w-md space-y-5 rounded-3xl p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3D52A0]/20 text-[#7091E6] shadow-inner">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-[var(--canvas-text)]">
          Page Not Found
        </h1>
        <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
          We could not find the page you were looking for. It may have moved or
          the link is broken.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="font-bold shadow-lg"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
