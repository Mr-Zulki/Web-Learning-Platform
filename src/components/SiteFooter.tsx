import Link from "next/link";
import { Container } from "./ui/Container";

export function SiteFooter() {
  return (
    <footer className="glass-panel mt-auto w-full py-8 text-xs text-[var(--canvas-text-muted)] transition-colors duration-200">
      <Container size="xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <span className="font-semibold text-[var(--canvas-text)]">
              DevCraft • HTML/CSS Interactive Platform
            </span>
            <span className="hidden opacity-40 sm:inline">|</span>
            <span>Local sandbox • Zero telemetry • Real-time AST checker</span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/lessons"
              className="font-medium transition-colors hover:text-[var(--canvas-text)]"
            >
              Curriculum
            </Link>
            <Link
              href="/dashboard"
              className="font-medium transition-colors hover:text-[var(--canvas-text)]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
