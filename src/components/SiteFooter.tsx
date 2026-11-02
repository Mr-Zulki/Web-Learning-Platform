import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-2px_16px_rgba(61,82,160,0.04)]">
      <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
          </div>
          <span className="font-title-md text-title-md text-primary font-bold">CodeCraft</span>
          <span className="font-body-sm text-body-sm text-outline ml-space-sm">
            © 2025 CodeCraft. Professional Interactive Learning Platform.
          </span>
        </div>
        <div className="flex items-center gap-space-lg font-body-sm text-body-sm text-on-surface-variant flex-wrap">
          <Link className="hover:text-on-surface transition-colors" href="/lessons">
            Curriculum
          </Link>
          <a className="hover:text-on-surface transition-colors" href="#curriculum">
            Documentation
          </a>
          <a className="hover:text-on-surface transition-colors" href="/api/health">
            API Reference
          </a>
          <a className="hover:text-on-surface transition-colors" href="/api/health">
            System Status
          </a>
        </div>
      </div>
    </footer>
  );
}
