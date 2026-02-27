"use client";

import { useState } from "react";
import { AnalysisResult } from "@/types";
import api from "@/utils/api";
import AudioPlayer from "./AudioPlayer";

interface ResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function Results({ result, onReset }: ResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "story"
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold gradient-text">Your Story is Ready!</h2>
        <p style={{ color: "var(--text-tertiary)" }}>
          Processed in {result.processing_time} seconds
        </p>
      </div>

      {/* Results Sections */}
      <div className="space-y-4">
        {/* Description Section */}
        <button
          onClick={() => toggleSection("description")}
          className="w-full glass-card p-6 hover:bg-opacity-90 transition-all duration-300 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📸</span>
              <div>
                <h3 className="font-bold transition-colors" style={{ color: "var(--text-primary)" }}>
                  <span className="group-hover:text-accent">Image/Video Analysis</span>
                </h3>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {result.description.substring(0, 50)}...
                </p>
              </div>
            </div>
            <span
              className={`transform transition-transform duration-300 ${
                expandedSection === "description" ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>

          {expandedSection === "description" && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--accent)", opacity: "0.2" }}>
              <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
                {result.description}
              </p>
            </div>
          )}
        </button>

        {/* Story Section */}
        <button
          onClick={() => toggleSection("story")}
          className="w-full glass-card p-6 hover:bg-opacity-90 transition-all duration-300 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-bold transition-colors" style={{ color: "var(--text-primary)" }}>
                  <span className="group-hover:text-accent">Generated Story</span>
                </h3>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {result.story.substring(0, 50)}...
                </p>
              </div>
            </div>
            <span
              className={`transform transition-transform duration-300 ${
                expandedSection === "story" ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>

          {expandedSection === "story" && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--accent)", opacity: "0.2" }}>
              <p className="leading-relaxed text-lg italic" style={{ color: "var(--text-secondary)" }}>
                "{result.story}"
              </p>
            </div>
          )}
        </button>

        {/* Audio Section */}
        {result.audio_url && (
          <button
            onClick={() => toggleSection("audio")}
            className="w-full glass-card p-6 hover:bg-opacity-90 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎙️</span>
                <div>
                  <h3 className="font-bold transition-colors" style={{ color: "var(--text-primary)" }}>
                    <span className="group-hover:text-accent">Audio Narration</span>
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Listen to your story</p>
                </div>
              </div>
              <span
                className={`transform transition-transform duration-300 ${
                  expandedSection === "audio" ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>

            {expandedSection === "audio" && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "var(--accent)", opacity: "0.2" }}
                onClick={(e) => e.stopPropagation()}
              >
                <AudioPlayer src={api.getAudioUrl(result.audio_url)} />
              </div>
            )}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="btn-primary transition-all duration-300"
        >
          ✨ Create Another Story
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t" style={{ borderColor: "var(--accent)", opacity: "0.2" }}>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {result.story.split(" ").length}
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Words</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {result.processing_time}s
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Processing</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">✅</div>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Complete</p>
        </div>
      </div>
    </div>
  );
}
