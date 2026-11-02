"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Roadmap" },
    { href: "/lessons/html-structure", label: "Workspace" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(61,82,160,0.08)]">
      <div className="h-16 w-full max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-space-sm group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[20px]">terminal</span>
          </div>
          <span className="font-title-md text-title-md text-primary tracking-tight font-bold text-[18px]">
            CodeCraft
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-space-xs">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-space-md py-1.5 rounded-lg font-title-md text-title-md transition-colors ${
                  isActive
                    ? "bg-surface-container-high text-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Session Area */}
        <div className="flex items-center gap-space-md">
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-xl bg-surface-container-high" />
          ) : session?.user ? (
            <div className="flex items-center gap-space-sm">
              <Link
                href="/dashboard"
                className="flex items-center gap-space-xs px-space-sm py-1 rounded-full hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/30"
              >
                <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-body-sm ring-1 ring-primary/20">
                  {session.user.name?.[0]?.toUpperCase() ||
                    session.user.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="font-title-md text-title-md text-on-surface font-medium hidden sm:inline-block ml-1">
                  {session.user.name || session.user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-error transition-colors px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="font-title-md text-title-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container shadow-sm hover:shadow transition-all"
              >
                Start Free
              </Link>
            </>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-outline-variant/30 bg-surface/95 px-4 pt-3 pb-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-base font-semibold ${
                  pathname === link.href
                    ? "bg-surface-container-high text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!session?.user && (
              <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/30 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-center font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-primary py-3 text-center font-semibold text-on-primary shadow-sm hover:bg-primary-container"
                >
                  Start Free
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
