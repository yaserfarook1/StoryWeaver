"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
  language?: string;
  onLanguageChange?: (language: string) => void;
}

const LANGUAGES = [
  { code: "english", label: "English" },
  { code: "tamil", label: "Tamil" },
  { code: "malayalam", label: "Malayalam" },
  { code: "hindi", label: "Hindi" },
];

export default function Navbar({ language = "english", onLanguageChange }: NavbarProps) {
  const pathname = usePathname();
  const isApp = pathname.startsWith("/app");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

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

            {/* Status indicator, Language Selector and Theme Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }}></span>
                <span>Ready</span>
              </div>

              {/* Language Selector */}
              <div className="relative group">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="px-3 py-2 rounded-lg transition-all duration-300 hover:opacity-80 text-sm font-medium"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                  }}
                  title="Select language"
                >
                  🌐 {LANGUAGES.find(l => l.code === language)?.label || "English"}
                </button>

                {showLanguageMenu && (
                  <div
                    className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange?.(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          language === lang.code ? "font-semibold" : ""
                        }`}
                        style={{
                          color: language === lang.code ? "var(--accent)" : "var(--text-secondary)",
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
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
