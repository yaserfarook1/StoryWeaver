"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useApi } from "@/hooks/useApi";
import LoadingSpinner from "./LoadingSpinner";
import ProcessingProgress from "./ProcessingProgress";
import toast from "react-hot-toast";

interface UploadZoneProps {
  isLoading: boolean;
  onUploadComplete: (file: File) => void;
}

export default function UploadZone({
  isLoading,
  onUploadComplete,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeFile } = useApi();

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/webm",
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. Please upload JPG, PNG, MP4, or WebM");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 50MB");
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setFileName(file.name);

    // Generate preview for images and videos
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process the file
    await onUploadComplete(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`glass-card p-8 sm:p-12 cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-2 bg-opacity-50 scale-105"
            : "border border-transparent"
        } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
        style={{
          borderColor: isDragging ? "var(--accent)" : "transparent",
        }}
        onClick={handleClick}
      >
        {!isLoading ? (
          <>
            {preview ? (
              <div className="space-y-4 text-center">
                {fileName.toLowerCase().endsWith(".mp4") ||
                fileName.toLowerCase().endsWith(".webm") ? (
                  <video
                    src={preview}
                    controls
                    className="max-h-64 mx-auto rounded-lg object-cover w-full"
                    style={{ maxHeight: "400px" }}
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                )}
                <p className="font-semibold text-sm truncate px-4" style={{ color: "var(--accent)" }}>
                  {fileName}
                </p>
              </div>
            ) : fileName ? (
              <div className="space-y-4 text-center">
                <div className="text-5xl">🎬</div>
                <p className="font-semibold text-sm truncate px-4" style={{ color: "var(--accent)" }}>
                  {fileName}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-float">📤</div>
                <div>
                  <p className="text-xl font-semibold gradient-text">
                    Drop your file here
                  </p>
                  <p className="mt-2" style={{ color: "var(--text-tertiary)" }}>
                    or click to select (JPG, PNG, MP4, WebM - Max 50MB)
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 text-center">
            {/* Show playable preview while processing */}
            {preview && (
              <div className="mb-6">
                {fileName.toLowerCase().endsWith(".mp4") ||
                fileName.toLowerCase().endsWith(".webm") ? (
                  <video
                    src={preview}
                    controls
                    className="max-h-48 mx-auto rounded-lg object-cover w-full opacity-75"
                    style={{ maxHeight: "300px" }}
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Processing"
                    className="max-h-48 mx-auto rounded-lg object-cover opacity-75"
                  />
                )}
              </div>
            )}
            <ProcessingProgress isActive={isLoading} />
            <p className="font-semibold" style={{ color: "var(--accent)" }}>
              Hang tight! Creating your story...
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,video/*"
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
