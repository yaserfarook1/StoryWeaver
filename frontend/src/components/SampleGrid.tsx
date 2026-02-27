"use client";

import { useState } from "react";
import { Sample } from "@/types";
import api from "@/utils/api";
import toast from "react-hot-toast";

interface SampleGridProps {
  samples: Sample[];
  isLoading: boolean;
  onSampleSelect: (sample: Sample) => void;
  onUploadComplete: (file: File) => Promise<void>;
  selectedSample: Sample | null;
}

export default function SampleGrid({
  samples,
  isLoading,
  onSampleSelect,
  onUploadComplete,
}: SampleGridProps) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Load thumbnail on hover
  const loadThumbnail = async (sample: Sample) => {
    try {
      const blob = await api.getSampleFile(sample.filename);
      const url = URL.createObjectURL(blob);
      setThumbnails((prev) => ({ ...prev, [sample.id]: url }));
    } catch (error) {
      console.error("Failed to load thumbnail:", error);
    }
  };

  const handleSampleClick = async (sample: Sample) => {
    if (isLoading) return;

    try {
      const blob = await api.getSampleFile(sample.filename);
      const file = new File([blob], sample.filename, {
        type: sample.type === "image" ? "image/jpeg" : "video/mp4",
      });

      // Reset state first
      onSampleSelect(sample);

      // Process the file using parent's analyzeFile hook
      await onUploadComplete(file);
    } catch (error) {
      toast.error("Failed to process sample");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
          Try Sample Files
        </h3>
        <p style={{ color: "var(--text-tertiary)" }}>
          Click any sample to see the magic in action
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleSampleClick(sample)}
            onMouseEnter={() => {
              loadThumbnail(sample);
              setHoveredId(sample.id);
            }}
            onMouseLeave={() => setHoveredId(null)}
            disabled={isLoading}
            className="group glass-card overflow-hidden text-left hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {/* Thumbnail Preview */}
            <div className="relative w-full h-48 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
              {thumbnails[sample.id] ? (
                sample.type === "image" ? (
                  <img
                    src={thumbnails[sample.id]}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <video
                    src={thumbnails[sample.id]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    autoPlay={hoveredId === sample.id}
                    muted
                    loop
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {sample.emoji}
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: "linear-gradient(to top, var(--bg-secondary), transparent, transparent)",
              }} />
            </div>

            {/* Info section */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold transition-colors" style={{ color: "var(--text-primary)" }}>
                    <span className="group-hover:" style={{ color: "var(--accent)" }}>{sample.name}</span>
                  </h4>
                  <p className="text-xs mt-1 capitalize" style={{ color: "var(--text-tertiary)" }}>
                    {sample.type === "image" ? "🖼️ Image" : "🎬 Video"}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent)" }}>
                  →
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ background: "var(--accent)" }} />
            </div>
          </button>
        ))}
      </div>

      {samples.length === 0 && (
        <div className="text-center py-8 glass-card">
          <p style={{ color: "var(--text-tertiary)" }}>
            No sample files found. Please add samples to the data/ folder.
          </p>
        </div>
      )}
    </div>
  );
}
