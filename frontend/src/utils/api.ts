import axios, { AxiosInstance } from "axios";
import { AnalysisResult, Sample, ApiResponse } from "@/types";

// Configure API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 10 minutes for large files
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get("/health");
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // Analyze image
  async analyzeImage(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<AnalysisResult>(
      "/api/analyze/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Analyze video
  async analyzeVideo(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<AnalysisResult>(
      "/api/analyze/video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Generate story
  async generateStory(text: string): Promise<{ story: string }> {
    const response = await apiClient.post("/api/generate/story", {
      text,
    });

    return response.data;
  },

  // Generate audio
  async generateAudio(text: string): Promise<{ audio_url: string }> {
    const response = await apiClient.post("/api/generate/audio", {
      text,
    });

    return response.data;
  },

  // Get samples list
  async getSamples(): Promise<Sample[]> {
    try {
      const response = await apiClient.get<ApiResponse<unknown>>(
        "/api/samples"
      );
      return response.data.samples || [];
    } catch {
      return [];
    }
  },

  // Get sample file
  async getSampleFile(filename: string): Promise<Blob> {
    // Pass filename directly to backend
    const response = await apiClient.get(`/api/samples/${filename}`, {
      responseType: "blob",
    });

    return response.data;
  },

  // Helper to get audio URL
  getAudioUrl(audioPath: string): string {
    if (audioPath.startsWith("http")) {
      return audioPath;
    }
    return `${API_BASE_URL}${audioPath}`;
  },

  // Helper to get file extension
  getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
  },

  // Helper to check if file is image
  isImage(filename: string): boolean {
    const ext = this.getFileExtension(filename);
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  },

  // Helper to check if file is video
  isVideo(filename: string): boolean {
    const ext = this.getFileExtension(filename);
    return ["mp4", "webm", "mov", "avi"].includes(ext);
  },
};

export default api;
