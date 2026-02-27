"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const isApp = pathname.startsWith("/app");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 glass-card backdrop-blur-md border-b" style={{ borderColor: "var(--glass-border)" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-2xl">✨</div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                StoryWeaver
              </h1>
              <p className="text-xs" style={{ color: "var(--accent)" }}>
                AI Story Generator
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link
                href="/"
                className={`transition-colors ${
                  !isApp
                    ? "font-semibold"
                    : "hover:opacity-70"
                }`}
                style={{
                  color: !isApp ? "var(--accent)" : "var(--text-tertiary)"
                }}
              >
                Home
              </Link>
              <Link
                href="/app"
                className={`transition-colors ${
                  isApp
                    ? "font-semibold"
                    : "hover:opacity-70"
                }`}
                style={{
                  color: isApp ? "var(--accent)" : "var(--text-tertiary)"
                }}
              >
                App
              </Link>
              <a
                href="#features"
                className="transition-colors hover:opacity-70"
                style={{ color: "var(--text-tertiary)" }}
              >
                Features
              </a>
            </div>

            {/* Status indicator and Theme Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }}></span>
                <span>Ready</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300 hover:opacity-80"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
