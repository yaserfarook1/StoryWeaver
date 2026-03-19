"use client";

import { useState, useCallback } from "react";
import api from "@/utils/api";
import { AnalysisResult, ProcessingState } from "@/types";
import toast from "react-hot-toast";

const initialState: ProcessingState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  result: null,
  progress: 0,
};

export function useApi() {
  const [state, setState] = useState<ProcessingState>(initialState);

  const analyzeFile = useCallback(async (file: File, language: string = "english") => {
    setState({ ...initialState, isLoading: true });

    try {
      let result: AnalysisResult;

      if (api.isImage(file.name)) {
        setState((prev) => ({ ...prev, progress: 10 }));
        result = await api.analyzeImage(file, language);
      } else if (api.isVideo(file.name)) {
        setState((prev) => ({ ...prev, progress: 10 }));
        result = await api.analyzeVideo(file, language);
      } else {
        throw new Error("Unsupported file type");
      }

      setState({
        isLoading: false,
        isError: false,
        errorMessage: "",
        result,
        progress: 100,
      });

      toast.success("Analysis complete!");
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      setState({
        isLoading: false,
        isError: true,
        errorMessage,
        result: null,
        progress: 0,
      });

      toast.error(errorMessage);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    analyzeFile,
    reset,
  };
}
