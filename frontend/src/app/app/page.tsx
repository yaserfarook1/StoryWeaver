"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import SampleGrid from "@/components/SampleGrid";
import Results from "@/components/Results";
import { useApi } from "@/hooks/useApi";
import { Sample } from "@/types";
import api from "@/utils/api";

export default function App() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const { isLoading, result, analyzeFile, reset } = useApi();

  useEffect(() => {
    const loadSamples = async () => {
      const sampleList = await api.getSamples();
      setSamples(sampleList);
    };

    loadSamples();
  }, []);

  const handleSampleClick = async (sample: Sample) => {
    setSelectedSample(sample);
    reset();
  };

  const handleUploadComplete = async (file: File) => {
    const result = await analyzeFile(file);
    if (result) {
      setSelectedSample(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-dark">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          <>
            <Hero />

            <section className="mt-16 mb-16 animate-slide-up">
              <UploadZone
                isLoading={isLoading}
                onUploadComplete={handleUploadComplete}
              />
            </section>

            {samples.length > 0 && (
              <section className="mt-20 animate-slide-up">
                <SampleGrid
                  samples={samples}
                  isLoading={isLoading}
                  onSampleSelect={handleSampleClick}
                  onUploadComplete={handleUploadComplete}
                  selectedSample={selectedSample}
                />
              </section>
            )}
          </>
        ) : (
          <Results result={result} onReset={reset} />
        )}
      </div>
    </main>
  );
}
