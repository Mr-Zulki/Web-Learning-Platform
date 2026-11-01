import Link from "next/link";
import { Container } from "./ui/Container";

export function SiteFooter() {
  return (
    <footer className="glass-panel mt-auto w-full border-t border-white/10 py-8 text-xs text-slate-400">
      <Container size="xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <span className="font-semibold text-slate-200">
              HTML/CSS Interactive Platform
            </span>
            <span className="hidden text-slate-600 sm:inline">|</span>
            <span>Local sandbox • Zero telemetry • Real-time AST checker</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/lessons"
              className="transition-colors hover:text-slate-200"
            >
              Curriculum
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-slate-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
