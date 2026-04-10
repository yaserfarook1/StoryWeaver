"use client";

import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((error) => {
        console.error("Play error:", error);
      });
    } else {
      audio.pause();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={src} crossOrigin="anonymous" />

      {/* Minimal Player */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Play Button */}
        <button
          onClick={togglePlayPause}
          className="flex-shrink-0 flex items-center justify-center transition-all"
          style={{
            width: "32px",
            height: "32px",
            color: "var(--text-primary)",
          }}
          title={isPlaying ? "Pause" : "Play"}
        >
          <span className="text-lg">{isPlaying ? "⏸" : "▶"}</span>
        </button>

        {/* Time Display */}
        <div className="flex-shrink-0 text-xs" style={{ color: "var(--text-secondary)", minWidth: "40px" }}>
          {formatTime(currentTime)}
        </div>

        {/* Progress Bar */}
        <div
          onClick={handleProgressClick}
          className="flex-1 h-1 rounded-full cursor-pointer transition-all hover:h-1.5"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              background: "var(--accent)",
            }}
          />
        </div>

        {/* Duration Display */}
        <div className="flex-shrink-0 text-xs" style={{ color: "var(--text-secondary)", minWidth: "40px", textAlign: "right" }}>
          {formatTime(duration)}
        </div>

        {/* Volume Control */}
        <button
          onClick={() => {
            const audio = audioRef.current;
            if (audio) {
              audio.volume = audio.volume === 0 ? 1 : 0;
            }
          }}
          className="flex-shrink-0 flex items-center justify-center transition-all"
          style={{
            color: "var(--text-primary)",
          }}
          title="Toggle volume"
        >
          <span className="text-lg">{audioRef.current?.volume === 0 ? "🔇" : "🔊"}</span>
        </button>

        {/* Menu Button */}
        <button
          className="flex-shrink-0 flex items-center justify-center transition-all"
          style={{
            color: "var(--text-secondary)",
          }}
          title="More options"
        >
          <span className="text-lg">⋮</span>
        </button>
      </div>
    </div>
  );
}
