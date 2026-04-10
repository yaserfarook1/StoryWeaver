"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

interface CameraCaptureProps {
  isLoading: boolean;
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export default function CameraCapture({
  isLoading,
  onCapture,
  onCancel,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"photo" | "video" | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setCameraError(null);
        }
      } catch (error) {
        const errorMessage =
          error instanceof DOMException
            ? error.name === "NotAllowedError"
              ? "Camera permission denied. Please enable camera access."
              : error.name === "NotFoundError"
                ? "No camera found on this device."
                : "Unable to access camera."
            : "Unable to access camera.";

        setCameraError(errorMessage);
        setCameraActive(false);
        toast.error(errorMessage);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current || document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Failed to capture photo");
      return;
    }

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to capture photo");
          return;
        }

        const file = new File([blob], "captured-photo.jpg", {
          type: "image/jpeg",
        });

        setCapturedFile(file);
        setPreview(canvas.toDataURL("image/jpeg"));
        setPreviewType("photo");
      },
      "image/jpeg",
      0.95
    );
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;

    chunksRef.current = [];
    const stream = videoRef.current.srcObject as MediaStream;

    try {
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
          ? "video/webm;codecs=vp8,opus"
          : "video/webm";

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], "captured-video.webm", {
          type: "video/webm",
        });

        setCapturedFile(file);
        const videoUrl = URL.createObjectURL(blob);
        setPreview(videoUrl);
        setPreviewType("video");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUseCapture = () => {
    if (!capturedFile) return;

    onCapture(capturedFile);
    resetCamera();
  };

  const resetCamera = () => {
    setPreview(null);
    setPreviewType(null);
    setCapturedFile(null);
    setRecordingTime(0);
  };

  if (cameraError && !cameraActive) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 sm:p-12 text-center space-y-4">
          <div className="text-5xl">⚠️</div>
          <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
            {cameraError}
          </p>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Please ensure camera permissions are enabled or use the upload option instead.
          </p>
          <button
            onClick={onCancel}
            className="mt-4 px-6 py-2 rounded-lg transition-all"
            style={{
              background: "var(--accent)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 sm:p-12 space-y-4">
        {!preview ? (
          <>
            {/* Live Camera Feed */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
                style={{ maxHeight: "500px", display: "block" }}
              />

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-red-500 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">
                    {Math.floor(recordingTime / 60)}:
                    {String(recordingTime % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center flex-wrap">
              {!isRecording ? (
                <>
                  <button
                    onClick={capturePhoto}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
                    style={{
                      background: "var(--accent)",
                      color: "white",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    📷 Capture Photo
                  </button>
                  <button
                    onClick={startRecording}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
                    style={{
                      background: "#ef4444",
                      color: "white",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    ⏺️ Start Recording
                  </button>
                </>
              ) : (
                <button
                  onClick={stopRecording}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
                  style={{
                    background: "#ef4444",
                    color: "white",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  ⏹️ Stop Recording
                </button>
              )}

              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                Back
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="space-y-4 text-center">
              {previewType === "photo" ? (
                <img
                  src={preview}
                  alt="Captured photo"
                  className="max-h-64 mx-auto rounded-lg object-cover w-full"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-h-64 mx-auto rounded-lg object-cover w-full"
                />
              )}

              <p
                className="font-semibold text-sm"
                style={{ color: "var(--accent)" }}
              >
                {previewType === "photo"
                  ? "Photo captured successfully!"
                  : "Video recorded successfully!"}
              </p>
            </div>

            {/* Preview Actions */}
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleUseCapture}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
                style={{
                  background: "var(--accent)",
                  color: "white",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                ✓ Use {previewType === "photo" ? "Photo" : "Video"}
              </button>
              <button
                onClick={resetCamera}
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                Try Again
              </button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
