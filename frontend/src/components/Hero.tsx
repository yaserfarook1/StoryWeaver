"use client";

export default function Hero() {
  return (
    <section className="text-center py-16 animate-fade-in">
      <div className="space-y-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          <span className="gradient-text">Transform</span> Your{" "}
          <span className="gradient-text">Imagination</span> into{" "}
          <span className="gradient-text">Stories</span>
        </h2>

        <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Upload an image or video, and let our AI create a captivating story
          with professional narration. Powered by cutting-edge generative AI.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="glass-card px-6 py-4 backdrop-blur-md">
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>✨ AI-Powered</p>
          </div>
          <div className="glass-card px-6 py-4 backdrop-blur-md">
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>🎭 Creative</p>
          </div>
          <div className="glass-card px-6 py-4 backdrop-blur-md">
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>⚡ Fast</p>
          </div>
        </div>
      </div>
    </section>
  );
}
