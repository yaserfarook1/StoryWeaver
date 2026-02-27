export interface AnalysisResult {
  status: string;
  description: string;
  story: string;
  audio_url?: string;
  processing_time: number;
}

export interface Sample {
  id: string;
  name: string;
  filename: string;
  type: "image" | "video";
  emoji: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  samples?: Sample[];
  message?: string;
  details?: string;
}

export interface ProcessingState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  result: AnalysisResult | null;
  progress: number;
}
