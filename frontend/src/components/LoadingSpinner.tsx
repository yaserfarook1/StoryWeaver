"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-3 border-transparent animate-spin"
          style={{
            borderTopColor: "var(--accent)",
            borderRightColor: "var(--accent)",
            opacity: 0.8,
          }}
        ></div>

        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent opacity-75 animate-spin"
          style={{
            borderBottomColor: "var(--accent)",
            animationDirection: "reverse",
          }}
        ></div>

        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-md"
          style={{
            background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)`,
          }}
        ></div>
      </div>
    </div>
  );
}
