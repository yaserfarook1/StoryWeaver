"use client";

import { useEffect, useState } from "react";

interface ProcessingProgressProps {
  isActive: boolean;
}

export default function ProcessingProgress({
  isActive,
}: ProcessingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Simulate progress that slows down as it approaches 95%
        if (prev < 30) return prev + Math.random() * 15;
        if (prev < 60) return prev + Math.random() * 10;
        if (prev < 90) return prev + Math.random() * 5;
        return Math.min(prev + 0.5, 95); // Cap at 95% until complete
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  // When complete, jump to 100%
  useEffect(() => {
    if (!isActive && progress > 0) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isActive, progress]);

  if (!isActive && progress === 0) return null;

  return (
    <div className="w-full space-y-3 animate-slide-down">
      {/* Progress Bar Container */}
      <div className="glass-card p-6 backdrop-blur-md">
        {/* Label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {isActive ? "Processing..." : "Complete!"}
            </p>
          </div>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{Math.round(progress)}%</span>
        </div>

        {/* Main Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden mb-4" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-300 shadow-lg"
            style={{
              width: `${progress}%`,
              background: "var(--accent)",
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
            }}
          />
        </div>

        {/* Status Message */}
        <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
          {progress < 25 && "Uploading file..."}
          {progress >= 25 && progress < 50 && "Analyzing with AI..."}
          {progress >= 50 && progress < 75 && "Generating story..."}
          {progress >= 75 && progress < 95 && "Creating audio..."}
          {progress >= 95 && "Finalizing..."}
        </p>
      </div>

      {/* Mini Indicators */}
      <div className="flex gap-2 justify-center">
        {[
          { label: "Upload", threshold: 25 },
          { label: "Analyze", threshold: 50 },
          { label: "Generate", threshold: 75 },
          { label: "Audio", threshold: 95 },
        ].map((step) => (
          <div
            key={step.label}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background: progress >= step.threshold ? "rgba(251, 191, 36, 0.2)" : "var(--border)",
              color: progress >= step.threshold ? "var(--accent)" : "var(--text-tertiary)",
            }}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
