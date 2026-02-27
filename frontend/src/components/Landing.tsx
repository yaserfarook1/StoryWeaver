"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Landing() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Transform Your Content Into Captivating Stories";
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Typing animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: "🎬",
      title: "Instant Conversion",
      description: "Convert images and videos to engaging stories in seconds",
    },
    {
      icon: "🤖",
      title: "AI-Powered",
      description: "Powered by state-of-the-art generative AI models",
    },
    {
      icon: "🎙️",
      title: "Natural Narration",
      description: "Professional quality audio narration for every story",
    },
    {
      icon: "✨",
      title: "Creative Stories",
      description: "Unique, engaging narratives tailored to your content",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Process multiple files simultaneously without delays",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Your content stays private, never stored on our servers",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "1M+", label: "Stories Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "< 10s", label: "Average Speed" },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Animated background gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.2), transparent 80%)`,
          transition: "background 0.3s ease-out",
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          {/* Animated badge */}
          <div className="mb-8 inline-block">
            <div className="glass-card px-6 py-2 backdrop-blur-md transition-all duration-300 hover:shadow-lg" style={{ borderColor: "var(--glass-border-hover)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                ✨ Welcome to the Future of Content
              </p>
            </div>
          </div>

          {/* Main heading with typing animation */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8 h-24 sm:h-28 lg:h-32 flex items-center justify-center">
            <span className="gradient-text animate-gradient">
              {displayedText}
              <span className="animate-blink">|</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ color: "var(--text-secondary)" }}>
            Upload an image or video and watch as our cutting-edge AI transforms
            it into a beautifully narrated story. No setup required. Completely
            free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Link href="/app">
              <button className="btn-primary px-8 py-4 text-lg font-semibold transition-all duration-300 group hover:shadow-lg">
                <span className="group-hover:mr-2 transition-all">Get Started</span>
                <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
              </button>
            </Link>
            <button className="btn-secondary px-8 py-4 text-lg font-semibold transition-all duration-300">
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Floating cards preview */}
          <div className="relative h-64 sm:h-80 mb-16 animate-float">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="glass-card p-8 backdrop-blur-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent)" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent)", opacity: "0.6" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent)", opacity: "0.3" }} />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded w-3/4 animate-pulse" style={{ background: "var(--border)" }} />
                      <div className="h-2 rounded w-full animate-pulse" style={{ background: "var(--border)" }} />
                      <div className="h-2 rounded w-5/6 animate-pulse" style={{ background: "var(--border)" }} />
                    </div>
                    <div className="pt-4 border-t" style={{ borderColor: "var(--accent)", opacity: "0.2" }}>
                      <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Processing... ✨</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20 animate-slide-up">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-card p-6 backdrop-blur-md transition-all duration-300 group cursor-pointer hover:shadow-lg"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <p className="text-xs sm:text-sm" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-tertiary)" }}>
              Everything you need to create stunning stories from your content
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="glass-card p-8 backdrop-blur-md transition-all duration-300 group hover:shadow-lg animate-slide-up"
                style={{ borderColor: "var(--glass-border)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--glass-border-hover)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--glass-border)";
                }}
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity" style={{ color: "var(--text-primary)" }}>
                  {feature.title}
                </h3>
                <p className="group-hover:opacity-80 transition-opacity" style={{ color: "var(--text-tertiary)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Upload Your Content",
                description: "Simply drag and drop your image or video",
              },
              {
                step: 2,
                title: "AI Analysis",
                description: "Our AI analyzes and understands your content",
              },
              {
                step: 3,
                title: "Story Generation",
                description: "Get a creative, engaging story generated instantly",
              },
              {
                step: 4,
                title: "Listen & Share",
                description: "Enjoy professional narration and download your story",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-6 animate-slide-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full glass-card text-xl font-bold gradient-text" style={{ borderColor: "var(--glass-border)" }}>
                    {item.step}
                  </div>
                </div>
                <div className="flex-grow pt-2">
                  <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-tertiary)" }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center animate-slide-up">
          <div className="glass-card p-12 backdrop-blur-md transition-all duration-300" style={{ borderColor: "var(--glass-border)" }}>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Ready to Get Started?</h2>
            <p className="mb-8 text-lg" style={{ color: "var(--text-secondary)" }}>
              Transform your first image or video into a story in minutes. No
              credit card required.
            </p>
            <Link href="/app">
              <button className="btn-primary px-8 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                Start Creating Now →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: "var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
            <p>© 2024 StoryWeaver. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: "var(--accent)" }}>
                Privacy
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: "var(--accent)" }}>
                Terms
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: "var(--accent)" }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
