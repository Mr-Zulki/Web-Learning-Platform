"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Moon, Sun, Menu, X, Code2 } from "lucide-react";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    try {
      return localStorage.getItem("uni:theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("uni:theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    } catch {
      // ignore
    }
  };

  return (
    <header className="glass-panel-elevated sticky top-0 z-40 w-full transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-lg font-bold tracking-tight focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3D52A0] via-[#7091E6] to-[#ADBBDA] shadow-md shadow-[#3D52A0]/25 transition-transform group-hover:scale-105">
            <Code2 className="h-5 w-5 text-[#EDE8F5]" aria-hidden="true" />
          </div>
          <span className="font-heading font-extrabold tracking-tight text-[var(--canvas-text)]">
            DevCraft
          </span>
          <span className="hidden text-xs font-semibold tracking-wider text-[var(--canvas-text-muted)] uppercase sm:inline">
            HTML/CSS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-2 md:flex"
        >
          <Link
            href="/lessons"
            className="rounded-xl px-3.5 py-2 text-sm font-medium text-[var(--canvas-text-secondary)] transition hover:bg-white/10 hover:text-[var(--canvas-text)] focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none"
          >
            Lessons
          </Link>

          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-xl bg-white/10" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-[var(--canvas-text-secondary)] transition hover:bg-white/10 hover:text-[var(--canvas-text)] focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none"
              >
                Dashboard
              </Link>
              <span className="text-sm font-medium text-[var(--canvas-text-muted)]">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-[var(--canvas-text-secondary)] transition hover:bg-white/10 hover:text-[var(--canvas-text)] focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none"
              >
                Login
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <div className="mx-2 h-5 w-px bg-white/15" />

          {/* Theme Toggle Button */}
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            className="text-[var(--canvas-text-secondary)] hover:text-[var(--canvas-text)]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[#ADBBDA]" />
            ) : (
              <Moon className="h-4 w-4 text-[#3D52A0]" />
            )}
          </IconButton>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            className="text-[var(--canvas-text-secondary)] hover:text-[var(--canvas-text)]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[#ADBBDA]" />
            ) : (
              <Moon className="h-4 w-4 text-[#3D52A0]" />
            )}
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[var(--canvas-text-secondary)] hover:text-[var(--canvas-text)]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </IconButton>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="glass-modal space-y-3 border-t border-white/10 px-4 py-4 md:hidden">
          <Link
            href="/lessons"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-base font-medium text-[var(--canvas-text)] hover:bg-white/10"
          >
            Lessons
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-base font-medium text-[var(--canvas-text)] hover:bg-white/10"
              >
                Dashboard
              </Link>
              <div className="px-3 py-1 text-xs text-[var(--canvas-text-muted)]">
                Signed in as {session.user.name || session.user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 border-t border-white/10 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-center text-base font-medium text-[var(--canvas-text)] hover:bg-white/10"
              >
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="md" variant="primary" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
